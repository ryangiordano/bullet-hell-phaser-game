import State from "../game-state/State";
import { styles } from "../lib/shared";

export class GameOverScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameOverScene" });
  }
  preload() {}

  init() {
    this.setInputs();
    this.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "GAME OVER",
      {
        color: "#ffffff",
      }
    );
  }
  setInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.addListener("down", () => {
      const state = State.getInstance();
      this.scene.stop("HUDScene");
      this.scene.stop("MainScene");
      state.resetGame();

      this.scene.start("HUDScene");
      this.scene.start("MainScene");
    });
  }

  update() {}
}
