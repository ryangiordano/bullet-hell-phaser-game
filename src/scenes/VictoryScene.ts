import State from "../game-state/State";
import { styles } from "../lib/shared";

export class VictoryScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "VictoryScene" });
  }
  preload() {}

  init(data) {
    this.setInputs();
    const titleText = {
      fontFamily: "pixel",
      color: styles.colors.darkGreen.string,
      fontSize: "50px",
      fontStyle: "bold",
    };
    const regularText = {
      fontFamily: "pixel",
      color: styles.colors.darkGreen.string,
      fontSize: "40px",
      fontStyle: "bold",
    };
    this.add.text(this.game.canvas.width / 6, 10, "The Egg Has Chosen You", {
      ...titleText,
    });
    this.add.text(30, 100, "Rivals missed", {
      ...regularText,
    });
    this.add.text(30, 170, "Damage taken", {
      ...regularText,
    });
    this.add.text(30, 240, "Max combo", {
      ...regularText,
    });

    this.add.text(30, 350, "You are a:", {
      ...regularText,
      fontSize: "35px",
    });

    this.add.text(30, 400, "Thoroughly Perfect Eviscerator", {
      ...regularText,
      fontSize: "40px",
    });
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
