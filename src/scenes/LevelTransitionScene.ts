/** Scene of rivals shooting up from the landscape */
export class LevelTransitionOneScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelTransitionOneScene" });
  }
  preload() {}

  async init({ levelId }) {
    setTimeout(() => {
      this.scene.stop();
      this.scene.start("LevelTransitionTwoScene", {
        levelId,
      });
    }, 1000);
  }

  update() {}
}

/** Head-on scene of rivals and hero flying upward */
export class LevelTransitionTwoScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelTransitionTwoScene" });
  }
  preload() {}

  async init({ levelId }) {
    setTimeout(() => {
      this.scene.stop();

      this.scene.start("LevelScene", {
        levelId,
      });
      this.scene.start("HUDScene");
    }, 1000);
  }

  update() {}
}
