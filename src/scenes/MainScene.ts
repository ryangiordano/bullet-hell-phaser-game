import { ExecutableLevelSegment } from "./../components/systems/LevelBuilder";
import Enemy from "../components/map-objects/enemies/Enemy";
import Hero, { HeroStates } from "../components/map-objects/hero/Hero";
import Particle from "../components/map-objects/background/Particle";
import Hit from "../components/map-objects/misc/Hit";
import State from "../game-state/State";
import Boundary from "../components/map-objects/background/Boundary";
import Antibody from "../components/map-objects/enemies/Antibody";
import Health from "../components/map-objects/items/Health";
import Egg from "../components/map-objects/Egg";
import { scaleIn } from "../lib/animation/Animations";
import levelOne from "../data/levels/1";

import { animateCombo, styles } from "../lib/shared";
import LevelBuilder, {
  LevelBlockType,
} from "../components/systems/LevelBuilder";
import Flash from "../components/map-objects/misc/Flash";
import ShockWave from "../components/map-objects/misc/ShockWave";
import { Collisions } from "../components/systems/Collisions";
import { wait } from "../lib/utility";

export class MainScene extends Phaser.Scene {
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

  constructor(key) {
    super({ key: key || "MainScene" });
    this.emitter.on("stop-background", () => {
      console.log("???");
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
    state.emitter.on("combo-milestone", () => {});
    state.emitter.on("game-over", async () => {
      await this.killHero();
      this.stopSpawningObstacles();
      this.scene.pause();
      this.scene.stop();
      this.game.scene.start("GameOverScene");
    });

    const collisions = new Collisions(this);
    collisions.setEnemyAntibodyCollisions(this.enemies, this.antibodies);

    collisions.setHeroAntibodyCollisions(this.hero, this.antibodies);

    collisions.setHeroItemsCollisions(this.hero, this.itemsLayer);

    collisions.setHeroGoalCollisions(this.hero, this.goal, async (egg: Egg) => {
      this.hero.kill();
      this.handleLevelComplete(egg);
    });

    collisions.setHeroEnemyCollisions(
      this.enemies,
      this.hero,
      async (enemy, hero) => {
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
      }
    );

    collisions.setEnemyShockwaveCollisions(this.enemies, this.shockwaves);

    this.postInit();
  }

  /** Set collisions for all items  */

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
    this.add.text(240, this.game.canvas.height / 2, "MISSION", {
      fontFamily: "pixel",
      color: styles.colors.darkGreen.string,
      fontSize: "50px",
      fontStyle: "bold",
    });
    await wait(500);
    this.add.text(500, this.game.canvas.height / 2, "COMPLETE", {
      fontFamily: "pixel",
      color: styles.colors.darkGreen.string,
      fontSize: "50px",
      fontStyle: "bold",
    });
    this.scene.pause();
    this.scene.stop("HUDScene");
    await wait(5000);
    this.scene.stop();
    this.scene.start("VictoryScene");
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
    const height = this.game.canvas.height;
    const width = this.game.canvas.width;

    const left = new Boundary(this, -250, height / 2, 500, height * 2);
    const right = new Boundary(this, width + 250, height / 2, 500, height * 2);
    const top = new Boundary(this, width / 2, -250, width * 2, 500);
    const bottom = new Boundary(this, width / 2, height + 250, width * 2, 500);

    const c = new Phaser.Physics.Arcade.StaticGroup(this.physics.world, this, [
      left,
      right,
      top,
      bottom,
    ]);

    left.init();
    right.init();
    top.init();
    bottom.init();

    this.physics.add.collider(c, this.boundaryCollide);
    this.physics.add.collider(c, this.goal);
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
    return levelBuilder.build(levelOne, {
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

  update() {}
}
