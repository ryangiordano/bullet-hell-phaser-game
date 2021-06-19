import { ExecutableLevelSegment } from "../components/systems/LevelBuilder";
import Enemy from "../components/map-objects/enemies/Enemy";
import Hero, { HeroStates } from "../components/map-objects/hero/Hero";
import Particle from "../components/map-objects/background/Particle";
import Hit from "../components/map-objects/misc/Hit";
import State from "../game-state/State";
import Boundary from "../components/map-objects/background/Boundary";
import Antibody from "../components/map-objects/enemies/Antibody";
import Health from "../components/map-objects/items/Health";
import Egg from "../components/map-objects/Egg";
import levelOne from "../data/levels/1";

import { animateCombo, setWorldBounds, styles } from "../lib/shared";
import LevelBuilder, {
  LevelBlockType,
} from "../components/systems/LevelBuilder";
import ShockWave from "../components/map-objects/misc/ShockWave";
import { wait } from "../lib/utility";
import { getLevelDataById } from "../data/levels/LevelRepository";

export class LevelScene extends Phaser.Scene {
  public emitter = new Phaser.Events.EventEmitter();
  public map: Phaser.Tilemaps.Tilemap;
  protected hero: Hero;
  protected goal: Phaser.GameObjects.Group;
  protected enemies: Phaser.GameObjects.Group;
  protected antibodies: Phaser.GameObjects.Group;
  protected shockwaves: Phaser.GameObjects.Group;
  protected particleLayer: Phaser.GameObjects.Group;
  protected itemsLayer: Phaser.GameObjects.Group;
  protected boundaryCollide: Phaser.GameObjects.Group;
  protected finishBoundary: Boundary;
  protected particleInterval: NodeJS.Timeout;
  protected levelId: number;
  constructor(key) {
    super({ key: key || "LevelScene" });
    this.emitter.on("stop-background", () => {
      this.stopBackground();
    });
  }
  preload() {}

  private killHero() {
    return new Promise<void>(async (resolve) => {
      await this.hero.kill();
      resolve();
    });
  }

  init({ levelId }) {
    this.levelId = levelId;
  }

  public create() {
    const state = State.getInstance();

    this.hero = this.physics.add.existing(
      new Hero(this, this.game.canvas.width / 2, this.game.canvas.height - 100)
    );
    this.hero.init();
    this.enemies = new Phaser.GameObjects.Group(this);
    this.goal = new Phaser.GameObjects.Group(this);
    this.antibodies = new Phaser.GameObjects.Group(this);
    this.shockwaves = new Phaser.GameObjects.Group(this);
    this.particleLayer = new Phaser.GameObjects.Group(this);
    this.itemsLayer = new Phaser.GameObjects.Group(this);
    this.boundaryCollide = new Phaser.GameObjects.Group(this, [this.hero]);

    const level = this.buildLevel();
    this.playLevel(level);
    this.animateParticles();

    this.setWorldBounds();
    this.setWorldGarbageCollector();

    /** Do something after hitting a certain number of combos */
    state.emitter.on("game-over", async () => {
      await this.killHero();
      this.stopSpawningObstacles();
      this.scene.pause();
      this.scene.stop();
      this.game.scene.start("GameOverScene");
    });

    this.setEnemyAntibodyCollisions(this.enemies, this.antibodies);

    this.setHeroAntibodyCollisions(this.hero, this.antibodies);

    this.setHeroItemsCollisions(this.hero, this.itemsLayer);

    this.setHeroGoalCollisions(this.hero, this.goal);
    this.setHeroEnemyCollisions(this.enemies, this.hero);

    this.setEnemyShockwaveCollisions(this.enemies, this.shockwaves);

    this.postInit();
  }

  /** Followup function for custom logic after scene initializes */
  protected postInit() {}

  /** Clear the timeout for any items that were on a timer
   * Used in Time Trial mode to stop all obstacles from spawning
   */
  protected stopSpawningObstacles() {
    clearTimeout(this.particleInterval);
  }

  protected async handleLevelComplete(egg: Egg) {
    await new Promise<void>((resolve) =>
      this.cameras.main.fadeOut(2000, 255, 255, 255, () => resolve())
    );
    await wait(2000);
    egg.idle();

    await wait(2000);

    const stopSparkle = egg.sparkle();
    await new Promise<void>((resolve) =>
      this.cameras.main.fadeIn(4000, 255, 255, 255, () => resolve())
    );

    await wait(4000);
    stopSparkle();
    this.endLevel();
  }

  protected async endLevel() {
    const state = State.getInstance();
    const textProps = {
      fontFamily: "pixel",
      color: styles.colors.darkGreen.string,
      fontSize: "50px",
      fontStyle: "bold",
    };

    this.add.text(240, this.game.canvas.height / 2, "MISSION", textProps);
    await wait(500);
    this.add.text(500, this.game.canvas.height / 2, "COMPLETE", textProps);
    this.scene.pause();
    this.scene.stop("HUDScene");
    await wait(5000);
    this.scene.stop();
    this.scene.start("VictoryScene", {
      rivalsMissed: state.getRivalsMissed(),
      damageTaken: state.getTotalDamageTaken(),
      maxCombo: state.getMaxCombo(),
    });
  }

  protected stopBackground() {
    this.stopSpawningObstacles();
    this.particleLayer.children.entries.forEach(
      (c: Phaser.Physics.Arcade.Sprite) => {
        c.setDrag(1500);
      }
    );
  }

  /** Set the static boundaries that keep the hero and goal from
   * wandering outside them.
   */
  private setWorldBounds() {
    const boundaryStaticGroup = setWorldBounds(this);

    this.physics.add.collider(boundaryStaticGroup, this.boundaryCollide);
    this.physics.add.collider(boundaryStaticGroup, this.goal);
  }

  /** Boundaries on the far outside edges of the canvas
   * that catches all enemies, obstacles and particles and destroys them
   */
  private setWorldGarbageCollector() {
    const height = this.game.canvas.height;
    const width = this.game.canvas.width;

    const top = new Boundary(this, width / 2, -600, width * 2, 0);
    const bottom = new Boundary(this, width / 2, height + 600, width * 2, 0);

    const c = new Phaser.Physics.Arcade.StaticGroup(this.physics.world, this, [
      top,
      bottom,
    ]);

    top.init();
    bottom.init();
    this.physics.add.overlap(c, this.antibodies, (entity) => {
      entity.destroy();
    });
    this.physics.add.overlap(c, this.enemies, (entity) => {
      const state = State.getInstance();
      state.setRivalsMissed(state.getRivalsMissed() + 1);
      entity.destroy();
    });

    this.physics.add.overlap(c, this.particleLayer, (entity) => {
      entity.destroy();
    });
  }

  /** To give a sense of movement, particles are set to flow
   * in the background
   */
  private animateParticles() {
    this.particleInterval = setInterval(() => {
      const p = new Particle(
        this,
        Math.random() * this.game.canvas.width,
        -500
      );
      p.init();
      this.particleLayer.add(p);
    }, 25);
  }

  /** Given data, build the level so that it can be executed in the playLevel function */
  private buildLevel() {
    const levelBuilder = new LevelBuilder(this);
    const levelData = getLevelDataById(this.levelId);
    return levelBuilder.build(levelData.level, {
      [LevelBlockType.antibody]: (e) => {
        this.antibodies.add(e);
      },
      [LevelBlockType.rival]: (e) => {
        this.enemies.add(e);
      },
      [LevelBlockType.goal]: (e) => {
        this.goal.add(e);
      },
    });
  }

  /** Play the given level, executing levelblocks in order */
  private playLevel(level: ExecutableLevelSegment[]) {
    const levelBuilder = new LevelBuilder(this);
    levelBuilder.play(level);
  }

  /** Enemies can hurt the hero, or get killed by him.
   * If the hero has a large enough combo, he can generate shockwaves
   */
  private setHeroEnemyCollisions(
    enemies: Phaser.GameObjects.Group,
    hero: Hero
  ) {
    const state = State.getInstance();
    this.physics.add.overlap(
      enemies,
      hero,
      async (enemy: Enemy, hero: Hero) => {
        /** Hero charges enemy */
        if (hero.charging && !enemy.dying) {
          const rand = Math.floor(Math.random() * 100);
          /** Enemy randomly drops health item */
          //TODO: Maybe make this part of the enemy class as a callback.
          if (rand > 90) {
            await wait(300);
            this.itemsLayer.add(new Health(this, enemy.x, enemy.y));
          }
          enemy.kill();
          const combo = state.getCurrentCombo();
          if (this.hero.heroState === HeroStates.super) {
            const s = new ShockWave(this, enemy.x, enemy.y, 9, 2);
            this.shockwaves.add(s);
          } else if (this.hero.heroState === HeroStates.superDuper) {
            const s = new ShockWave(this, enemy.x, enemy.y, 9, 4);
            this.shockwaves.add(s);
          }
          state.incrementCombo();
          this.hero.setHeroStateOnCombo(combo);

          animateCombo(enemy.x, enemy.y, state.getCurrentCombo(), this);
          hero.knockBack(300);

          this.add.existing(new Hit(this, hero.x, hero.y));
        } else if (!hero.invuln && !hero.charging) {
          this.add.existing(new Hit(this, enemy.x, enemy.y));
          state.setTotalDamageTaken(state.getTotalDamageTaken() + 1);
          hero.getHurt();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );
  }

  /** Enemies get killed by shockwaves, incrementing your combo */
  private setEnemyShockwaveCollisions(
    enemies: Phaser.GameObjects.Group,
    shockwaves: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.physics.add.overlap(enemies, shockwaves, (enemy: Enemy) => {
      if (!enemy.dying) {
        enemy.kill();
        state.incrementCombo();
        animateCombo(enemy.x, enemy.y, state.getCurrentCombo(), this);
      }
    });
  }

  /** Hero gets hurt by antibodies */
  private setHeroAntibodyCollisions(
    hero: Hero,
    antibodies: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.physics.add.overlap(
      hero,
      antibodies,
      (hero: Hero, antibody: Antibody) => {
        if (!hero.invuln) {
          this.add.existing(new Hit(this, hero.x, hero.y));
          state.setTotalDamageTaken(state.getTotalDamageTaken() + 1);
          hero.getHurt();
          antibody.jiggle();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );
  }

  /** The enemies are killed by antibodies */
  private setEnemyAntibodyCollisions(
    enemies: Phaser.GameObjects.Group,
    antibodies: Phaser.GameObjects.Group
  ) {
    this.physics.add.overlap(
      enemies,
      antibodies,
      (enemy: Enemy, antibody: Antibody) => {
        antibody.jiggle();

        if (!enemy.dying) {
          enemy.kill();
          this.add.existing(new Hit(this, enemy.x, enemy.y));
        }
      }
    );
  }

  /** There hero collects items */
  private setHeroItemsCollisions(
    hero: Hero,
    itemsLayer: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.physics.add.overlap(hero, itemsLayer, (_, item) => {
      item.destroy();
      state.incrementHealth();
    });
  }

  /** The goal can interact with the hero.
   * Upon being charged at, the game will transition to the win scene
   */
  private setHeroGoalCollisions(hero: Hero, goal: Phaser.GameObjects.Group) {
    this.physics.add.collider(goal, hero, async (egg: Egg, hero: Hero) => {
      const state = State.getInstance();
      egg.jiggle();

      if (hero.charging && !egg.invulnerable) {
        if (!state.getLevelComplete()) {
          egg.setVelocity(0, 0);
          await egg.takeDamage();
          if (egg.defeated) {
            this.hero.kill();
            this.handleLevelComplete(egg);
          }
        }
      }
    });
  }

  update() {}
}
