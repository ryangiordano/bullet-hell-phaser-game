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
    this.scene.start("LevelSelectScene");
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
    this.load.spritesheet(
      "heart-small",
      "./src/assets/sprites/heart-small.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
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

    this.load.spritesheet("level-egg", "./src/assets/sprites/level-egg.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet("antibody", "./src/assets/sprites/antibody.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet("health", "./src/assets/sprites/health.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("egg", "./src/assets/sprites/egg.png", {
      frameWidth: 512,
      frameHeight: 512,
    });

    this.load.spritesheet("sparkle", "./src/assets/sprites/sparkle.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet("shock-wave", "./src/assets/sprites/shock-wave.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet("critical", "./src/assets/sprites/critical.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet("flash", "./src/assets/sprites/flash.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.image("background", "./src/assets/images/background.png");
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
