import State from "../game-state/State";
import { styles } from "../lib/styles";

export class GameOverScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "GameOverScene" });
  }
  preload() {}

  init() {
    this.setInputs();
    const titleText = {
      fontFamily: "pixel",
      color: styles.colors.dark.string,
      fontSize: "50px",
      fontStyle: "bold",
    };
    this.add.text(350, this.game.canvas.height / 2, "GAME OVER", {
      ...titleText,
    });
  }
  setInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.addListener("down", () => {
      const state = State.getInstance();
      this.scene.stop("HUDScene");
      this.scene.stop("MainScene");
      state.resetGame();

      this.scene.start("LevelSelectScene");
    });
  }

  update() {}
}
