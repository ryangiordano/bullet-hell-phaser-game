export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private loaded: boolean = false;
  constructor() {
    super({ key: "BootScene" });
  }

  public init() {
    if (this.loaded) {
      this.runStartupProcess();
    }
  }
  private runStartupProcess() {
    setTimeout(() => {
      this.scene.start("MainScene");
      this.scene.start("HUDScene");
    });
  }

  preload(): void {
    this.load.pack(
      "preload_tilemaps",
      "./src/assets/pack/tilemaps.json",
      "preload_tilemaps"
    );
    this.load.pack(
      "preload_tilemaps",
      "./src/assets/pack/image.json",
      "preload_tilemaps"
    );

    this.load.pack(
      "preload_tilemaps",
      "./src/assets/maps/tilesets/main.json",
      "preload_tilemaps"
    );
    this.load.spritesheet("heart-small", "./src/assets/sprites/heart-small.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
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

    this.load.spritesheet("hit", "./src/assets/sprites/hit.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.createLoadingGraphics();
    this.load.on("complete", () => {
      this.loaded = true;
      this.runStartupProcess();
    });
  }
  private createLoadingGraphics(): void {
    // We can specify the type of config we want to send.
  }
}
