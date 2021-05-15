import Enemy from "../components/map-objects/enemies/Enemy";
import Hero from "../components/map-objects/hero/Hero";

export class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  private hero: Hero;
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

  }

  public create() {
    this.hero = this.physics.add.existing(new Hero(this, 100, 100));
    this.hero.init();
    setInterval(() => {
      const e = new Enemy(
        this,
        Math.random() * 1000,
        this.game.canvas.height + 50
      );
    }, 1000);
  }

  private setInputs() {
    // this.input.on("pointerdown", (pointer, e) => {});
    // this.input.on("pointermove", () => {});
  }

  update() {}
}
