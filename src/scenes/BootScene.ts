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
