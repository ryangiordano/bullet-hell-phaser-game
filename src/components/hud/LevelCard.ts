import { styles } from "../../lib/styles";
import { LevelData } from "../../data/levels/LevelRepository";
import { getMedalFromScore } from "../systems/LevelScore";
import MiniMedal from "../victory/MiniMedal";

function fade(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  duration = 300,
  fromY,
  toY,
  fromAlpha,
  toAlpha
) {
  return new Promise<void>((resolve) => {
    const timeline = scene.tweens.createTimeline({
      targets: target,
      loop: 0,
    });
    timeline.add({
      targets: target,
      y: {
        getStart: () => fromY,
        getEnd: () => toY,
      },
      alpha: {
        getStart: () => fromAlpha,
        getEnd: () => toAlpha,
      },
      duration: duration,
    });
    timeline.setCallback("onComplete", () => {
      resolve();
    });
    timeline.play();
  });
}

export default class LevelCard extends Phaser.GameObjects.Container {
  private card: Phaser.GameObjects.Rectangle;
  public displaying: boolean = false;
  public leaving: boolean = false;
  public entering: boolean = false;
  private originalCoords: { x: number; y: number };

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
    this.originalCoords = { x, y };
  }

  async showCard(levelData: LevelData) {
    this.displaying = true;
    this.updateCard(levelData);
    this.entering = true;
    await fade(
      this.scene,
      this,
      50,
      this.originalCoords.y - 50,
      this.originalCoords.y,
      0,
      1
    );
    this.entering = false;
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

  async hideCard() {
    this.leaving = true;

    await fade(
      this.scene,
      this,
      50,
      this.originalCoords.y,
      this.originalCoords.y - 5,
      1,
      0
    );
    this.displaying = false;
    this.leaving = false;
    this.clearCard();
  }
}
