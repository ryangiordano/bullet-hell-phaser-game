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

import { styles } from "../lib/shared";
import LevelBuilder, {
  LevelBlockType,
} from "../components/systems/LevelBuilder";
import Flash from "../components/map-objects/misc/Flash";
import ShockWave from "../components/map-objects/misc/ShockWave";

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
  protected finishBoundary: Boundary;
  protected particleInterval: NodeJS.Timeout;

  protected boundaryCollide: Phaser.GameObjects.Group;
  constructor(key) {
    super({ key: key || "MainScene" });
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

  /** Animate combo visual */
  private animateCombo(x, y) {
    const state = State.getInstance();
    const combo = state.getCurrentCombo();

    if (combo === 5 || combo >= 20) {
      const state = State.getInstance();
      const c = new Phaser.GameObjects.Container(this, x, y);
      this.add.existing(c);

      const f = new Flash(this, 0, 0);
      const text = new Phaser.GameObjects.Text(
        this,
        -12,
        -15,
        `${state.getCurrentCombo()}`,
        {
          fontSize: "25px",
          fontStyle: "bold",
          fontFamily: "pixel",
          color: styles.colors.green.string,
          wordWrap: {
            width: 100,
          },
        }
      );
      text.setAlign("center");
      c.add(f);
      c.add(text);

      const tl = scaleIn(c, this, () => {
        f.destroy();
      });
      tl.play();
    }
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

    //TODO: Implement a better way to do this.
    // this.setFinish();

    /** Do something after hitting a certain number of combos */
    state.emitter.on("combo-milestone", () => {});
    state.emitter.on("game-over", async () => {
      await this.killHero();
      this.stopSpawningObstacles();
      this.scene.pause();
      this.game.scene.start("GameOverScene");
    });

    // Set collisions

    /** Enemies can hurt the hero, or get killed by him.
     * If the hero has a large enough combo, he can generate shockwaves
     */
    this.physics.add.overlap(
      this.enemies,
      this.hero,
      (enemy: Enemy, hero: Hero) => {
        /** Hero charges enemy */
        if (hero.charging && !enemy.dying) {
          const rand = Math.floor(Math.random() * 100);
          /** Enemy randomly drops health item */
          //TODO: Maybe make this part of the enemy class as a callback.
          if (rand > 90) {
            setTimeout(() => {
              this.itemsLayer.add(new Health(this, enemy.x, enemy.y));
            }, 300);
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

          this.animateCombo(enemy.x, enemy.y);
          hero.knockBack(300);

          this.add.existing(new Hit(this, hero.x, hero.y));
        } else if (!hero.invuln && !hero.charging) {
          this.add.existing(new Hit(this, enemy.x, enemy.y));
          hero.getHurt();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );

    /** Enemies get killed by shockwaves, incrementing your combo */
    this.physics.add.overlap(this.enemies, this.shockwaves, (enemy: Enemy) => {
      if (!enemy.dying) {
        enemy.kill();
        state.incrementCombo();
        this.animateCombo(enemy.x, enemy.y);
      }
    });

    /** Hero gets hurt by antibodies */
    this.physics.add.overlap(
      this.hero,
      this.antibodies,
      (hero: Hero, antibody: Antibody) => {
        if (!hero.invuln) {
          this.add.existing(new Hit(this, hero.x, hero.y));
          hero.getHurt();
          antibody.jiggle();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );

    /** The enemies are killed by antibodies */
    this.physics.add.overlap(
      this.enemies,
      this.antibodies,
      (enemy: Enemy, antibody: Antibody) => {
        antibody.jiggle();

        if (!enemy.dying) {
          enemy.kill();
          this.add.existing(new Hit(this, enemy.x, enemy.y));
        }
      }
    );

    /** There hero collects items */
    this.physics.add.overlap(this.hero, this.itemsLayer, (_, item) => {
      item.destroy();
      state.incrementHealth();
    });

    /** The goal can interact with the hero
     * Upon being charged at, the game will transition to the win scene
     */
    this.physics.add.collider(this.goal, this.hero, (egg: Egg, hero: Hero) => {
      const state = State.getInstance();
      egg.jiggle();

      if (hero.charging) {
        if (!state.getLevelComplete()) {
          egg.setVelocity(0, 0);
          egg.wake();
          this.add.text(450, this.game.canvas.height / 2, "GOAL", {
            fontFamily: "pixel",
            color: styles.colors.darkGreen.string,
            fontSize: "50px",
            fontStyle: "bold",
          });
          this.scene.pause();
          this.scene.stop("HUDScene");
          setTimeout(() => {
            this.scene.stop();
            this.scene.start("VictoryScene");
          }, 2000);
        }
      }
    });

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

    const left = new Boundary(this, 0, height / 2, 0, height * 2);
    const right = new Boundary(this, width, height / 2, 0, height * 2);
    const top = new Boundary(this, width / 2, 0, width * 2, 0);
    const bottom = new Boundary(this, width / 2, height, width * 2, 0);

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
