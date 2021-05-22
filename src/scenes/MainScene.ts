import Enemy from "../components/map-objects/enemies/Enemy";
import Hero from "../components/map-objects/hero/Hero";
import Particle from "../components/map-objects/background/Particle";
import Hit from "../components/map-objects/misc/Hit";
import State from "../game-state/State";
import Boundary from "../components/map-objects/background/Boundary";
import Antibody from "../components/map-objects/enemies/Antibody";
import Health from "../components/map-objects/items/Health";

export class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  private hero: Hero;
  private enemies: Phaser.GameObjects.Group;
  private antibodies: Phaser.GameObjects.Group;
  private particleLayer: Phaser.GameObjects.Group;
  private itemsLayer: Phaser.GameObjects.Group;
  private finishBoundary: Boundary;
  private antibodyInterval: NodeJS.Timeout;
  private enemyInterval: NodeJS.Timeout;
  private particleInterval: NodeJS.Timeout;
  private finishLineTimeout: NodeJS.Timeout;
  constructor() {
    super({ key: "MainScene" });
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
    this.antibodies = new Phaser.GameObjects.Group(this);
    this.particleLayer = new Phaser.GameObjects.Group(this);
    this.itemsLayer = new Phaser.GameObjects.Group(this);
    this.animateParticles();
    this.addCompetition();

    this.addAntibodies();

    this.setWorldBounds();
    this.setWorldGarbageCollector();

    //TODO: Implement a better way to do this.
    this.setFinishLine();

    /** Do something after hitting a certain number of combos */
    state.emitter.on("combo-milestone", () => {});
    state.emitter.on("game-over", async () => {
      await this.killHero();
      this.tearDown();
      this.scene.pause();
      this.game.scene.start("GameOverScene");
    });
    // Set collisions
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
          state.incrementCombo();
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

    this.physics.add.overlap(this.hero, this.antibodies, (hero: Hero) => {
      if (!hero.invuln) {
        this.add.existing(new Hit(this, hero.x, hero.y));
        hero.getHurt();
        state.setCombo(0);
        state.decrementHealth();
      }
    });

    this.physics.add.overlap(this.enemies, this.antibodies, (enemy: Enemy) => {
      if (!enemy.dying) {
        enemy.kill();
        this.add.existing(new Hit(this, enemy.x, enemy.y));
      }
    });
    this.physics.add.overlap(this.hero, this.itemsLayer, (_, item) => {
      item.destroy();
      state.incrementHealth();
    });
  }

  private tearDown() {
    clearTimeout(this.antibodyInterval);
    clearTimeout(this.particleInterval);
    clearTimeout(this.enemyInterval);
    clearTimeout(this.finishLineTimeout);
  }

  private setWorldBounds() {
    const height = this.game.canvas.height;
    const width = this.game.canvas.width;

    const left = new Boundary(this, 0, height / 2, 0, height);
    const right = new Boundary(this, width, height / 2, 0, height);
    const top = new Boundary(this, width / 2, 0, width, 0);
    const bottom = new Boundary(this, width / 2, height, width, 0);

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

    this.physics.add.collider([c], this.hero);
  }

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

  private animateParticles() {
    this.particleInterval = setInterval(() => {
      const p = new Particle(this, Math.random() * this.game.canvas.width, -50);
      p.init();
      this.particleLayer.add(p);
    }, 50);
  }

  private addAntibodies() {
    this.antibodyInterval = setInterval(() => {
      this.antibodies.add(
        new Antibody(this, Math.random() * this.game.canvas.width, -200)
      );
    }, 3000);
  }

  private addCompetition() {
    this.enemyInterval = setInterval(() => {
      this.enemies.add(
        new Enemy(
          this,
          Math.random() * this.game.canvas.width,
          this.game.canvas.height + 50
        )
      );
    }, 1000);
  }

  /** After 20 seconds, the finish line descends and ends the game */
  private setFinishLine() {
    this.finishLineTimeout = setTimeout(() => {
      const state = State.getInstance();
      this.finishBoundary = new Boundary(
        this,
        this.game.canvas.width / 2,
        0,
        10,
        this.game.canvas.width
      );
      this.finishBoundary.init();
      this.finishBoundary.body.setSize(this.game.canvas.width, 10);
      this.finishBoundary.setVelocityY(100);
      this.physics.add.overlap(this.hero, this.finishBoundary, () => {
        if (!state.getLevelComplete()) {
          state.setLevelComplete(true);
          console.log("Finished");
        }
      });
    }, 20000);
  }

  update() {}
}
