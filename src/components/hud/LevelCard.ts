import { styles } from "../../lib/styles";
import { LevelData } from "../../data/levels/LevelRepository";
import { getMedalFromScore } from "../systems/LevelScore";
import MiniMedal from "../victory/MiniMedal";

export default class LevelCard extends Phaser.GameObjects.Container {
  private card: Phaser.GameObjects.Rectangle;
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.card = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      400,
      200,
      styles.colors.white.hex
    );
    this.card.setOrigin(0, 0);
    this.add(this.card);
  }

  showCard(levelData: LevelData) {
    this.updateCard(levelData);
    this.setAlpha(1);
  }

  setSmallCard() {
    this.card.setSize(250, 75);
  }

  setLargeCard() {
    this.card.setSize(400, 120);
  }

  updateCard(levelData: LevelData) {
    if (levelData.levelScoreData) {
      this.setLargeCard();
      const t = this.scene.add.text(
        20,
        20,
        `${levelData.name} (${levelData.levelScoreData.aggregateScore}%)`,
        {
          fontStyle: "bold",
          fontSize: "23px",
          color: styles.colors.black.string,
          fontFamily: "pixel",
        }
      );

      const { enemiesDefeated, maxCombo, damageTaken } =
        levelData.levelScoreData;
      [enemiesDefeated, maxCombo, damageTaken].forEach((percentage, index) => {
        const medalType = getMedalFromScore(percentage);
        this.add(new MiniMedal(this.scene, 40 * index + 30, 80, medalType));
      });
      this.add(t);
    } else {
      const t = this.scene.add.text(20, 20, levelData.name, {
        fontStyle: "bold",
        fontSize: "23px",
        color: styles.colors.black.string,
        fontFamily: "pixel",
      });
      this.add(t);
      this.setSmallCard();
    }
  }
  clearCard() {
    this.getAll().forEach((f) =>
      f.type === "Text" || f.type === "Sprite" ? f.destroy() : null
    );
  }
  hideCard() {
    this.setAlpha(0);
    this.clearCard();
  }
}
