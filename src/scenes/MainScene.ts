import Enemy from "../components/map-objects/enemies/Enemy";
import Hero from "../components/map-objects/hero/Hero";
import Particle from "../components/map-objects/background/Particle";

export class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  private hero: Hero;
  private enemies: Phaser.GameObjects.Group;
  private particleLayer: Phaser.GameObjects.Container;
  constructor() {
    super({ key: "MainScene" });
  }
  preload() {
    // Move this into the hero somehow
    this.load.spritesheet("hero", "./src/assets/sprites/hero.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("enemy", "./src/assets/sprites/enemy.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("particles", "./src/assets/sprites/particles.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

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
      (object1: Enemy, object2: Hero) => {
        object2.getHurt();
      }
    );
  }

  private animateParticles() {
    setInterval(() => {
      const p = new Particle(this, Math.random() * 1000, -50);
      // this.particleLayer.add(p);
      p.init();
    }, 100);
  }

  private setInputs() {
    // this.input.on("pointerdown", (pointer, e) => {});
    // this.input.on("pointermove", () => {});
  }

  update() {}
}
