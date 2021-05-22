import { styles } from "../lib/shared";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }
  preload() {}

  init() {
    this.add.text(0, 0, "GAME OVER", {
      color: "#ffffff",
    });
  }

  update() {}
}
