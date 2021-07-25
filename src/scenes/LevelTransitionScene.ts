import { styles } from "../lib/styles";
import { wait } from "../lib/utility";
import { getLevelDataById } from "../data/levels/LevelRepository";

/** Scene of rivals shooting up from the landscape */
export class LevelTransitionOneScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelTransitionOneScene" });
  }
  preload() {}

  async init({ levelId }) {
    await wait(1000);
    const level = getLevelDataById(levelId);
    const levelTitle = level.name;
    const levelDescription = level.description;

    this.add.text(100 + 230, this.game.canvas.height / 2 - 100, levelTitle, {
      fontFamily: "pixel",
      color: styles.colors.dark.string,
      fontSize: "50px",
      fontStyle: "bold",
    });

    await wait(1000);

    this.add.text(100 + 230, this.game.canvas.height / 2, levelDescription, {
      fontFamily: "pixel",
      color: styles.colors.dark.string,
      fontSize: "30px",
      fontStyle: "bold",
      align: "center",
    });
    setTimeout(() => {
      this.scene.stop();
      this.scene.start("LevelTransitionTwoScene", {
        levelId,
      });
    }, 2000);
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
    }, 1);
  }

  update() {}
}
