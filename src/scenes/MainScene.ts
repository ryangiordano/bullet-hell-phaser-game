import Enemy from "../components/map-objects/enemies/Enemy";
import Hero from "../components/map-objects/hero/Hero";
import Particle from "../components/map-objects/background/Particle";
import Hit from "../components/map-objects/misc/Hit";
import State from "../game-state/State";

export class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  private hero: Hero;
  private enemies: Phaser.GameObjects.Group;
  private particleLayer: Phaser.GameObjects.Container;
  constructor() {
    super({ key: "MainScene" });
  }
  preload() {}

  public create() {
    this.hero = this.physics.add.existing(new Hero(this, 100, 100));
    this.hero.init();
    this.enemies = new Phaser.GameObjects.Group(this);
    this.particleLayer = new Phaser.GameObjects.Container(this);
    this.animateParticles();
    setInterval(() => {
      const e = new Enemy(
        this,
        Math.random() * 1000,
        this.game.canvas.height + 50
      );
      this.enemies.add(e);
    }, 1000);

    // Set collisions
    this.physics.add.overlap(
      this.enemies,
      this.hero,
      (enemy: Enemy, hero: Hero) => {
        if (hero.charging && !enemy.dying) {
          enemy.kill();
          hero.knockBack(300);
          this.add.existing(new Hit(this, hero.x, hero.y));
        } else if (!hero.invuln && !hero.charging) {
          this.add.existing(new Hit(this, enemy.x, enemy.y));
          hero.getHurt();
          const state = State.getInstance();
          state.decrementHealth();
        }
      }
    );
  }

  private animateParticles() {
    setInterval(() => {
      const p = new Particle(this, Math.random() * 1000, -50);
      p.init();
    }, 100);
  }

  private setInputs() {
    // this.input.on("pointerdown", (pointer, e) => {});
    // this.input.on("pointermove", () => {});
  }

  update() {}
}
