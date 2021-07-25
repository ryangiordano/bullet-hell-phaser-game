import State from "../game-state/State";
import { wait } from "../lib/utility";
import Medal from "../components/victory/Medal";
import {
  calculateLevelCompletePercentage,
  getMedalFromScore,
  MedalType,
} from "../components/systems/LevelScore";
import { styles } from "../lib/styles";
import { levelData, getLevelDataById } from "../data/levels/LevelRepository";

function getRegularTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.dark.string,
    fontSize: "35px",
    fontStyle: "bold",
  };
}
function getTitleTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.dark.string,
    fontSize: "50px",
    fontStyle: "bold",
  };
}
function getGiantTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.dark.string,
    fontSize: "110px",
  };
}

function fadeIn(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  duration = 300
) {
  return new Promise<void>((resolve) => {
    const timeline = scene.tweens.createTimeline({
      targets: target,
      loop: 0,
    });
    timeline.add({
      targets: target,
      scaleX: {
        getStart: () => 2,
        getEnd: () => 1,
      },
      scaleY: {
        getStart: () => 2,
        getEnd: () => 1,
      },
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      duration: duration,
    });
    timeline.setCallback("onComplete", () => {
      resolve();
    });
    timeline.play();
  });
}

function fadeInOut(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  duration = 1000
) {
  return new Promise<void>((resolve) => {
    const timeline = scene.tweens.createTimeline({
      targets: target,
      loop: -1,
    });
    timeline.add({
      targets: target,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      yoyo: true,
      duration: duration,
    });

    timeline.play();
  });
}

function animateToScore(
  startingScore: number,
  goalScore: number,
  text: Phaser.GameObjects.Text,
  duration: number = 500
) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (startingScore >= goalScore) {
        resolve();
        return clearInterval(interval);
      }
      startingScore++;
      text.setText(`${startingScore}`);
    }, duration / goalScore);
  });
}

export class VictoryScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "VictoryScene" });
  }
  preload() {}

  async init({
    enemiesDefeated,
    maxCombo,
    damageTaken,
    totalEnemies,
    levelId,
  }) {
    this.setInputs();
    this.add.text(this.game.canvas.width / 5, 10, "Mission Breakdown", {
      ...getTitleTextProps(),
    });
    await this.renderBreak(500, 90);

    const {
      enemiesDefeated: enemiesDefeatedPercentage,
      maxCombo: maxComboPercentage,
      damageTaken: damageTakenPercentage,
      aggregateScore,
    } = calculateLevelCompletePercentage({
      enemiesDefeated,
      maxCombo,
      totalEnemies,
      damageTaken,
    });

    await this.renderEnemiesDefeated(
      enemiesDefeated,
      enemiesDefeatedPercentage
    );

    await wait(1000);
    await this.renderDamageTaken(damageTaken, damageTakenPercentage);
    await wait(1000);
    await this.renderMaxCombo(maxCombo, maxComboPercentage);
    await wait(1000);
    await this.renderBreak(500, 750);
    await wait(1000);
    await this.renderOverallScore(aggregateScore);
    const state = State.getInstance();

    state.saveLevelScoreData({
      levelId,
      maxCombo,
      enemiesDefeated,
      damageTaken,
      totalEnemies,
    });

    const unlockedLevelId = getLevelDataById(levelId)?.unlocks;
    if (unlockedLevelId) {
      state.setLevelUnlocked(unlockedLevelId);
    }
    this.renderPressSpacebar();
  }

  async renderBreak(x: number, y: number) {
    const breakShape = this.add.rectangle(x, y, 700, 5, styles.colors.dark.hex);
    breakShape.setAlpha(0);
    await fadeIn(this, breakShape);
  }

  private async createScoreBox(
    title: string,
    score: number,
    scorePercentage: number,
    x: number,
    y: number
  ) {
    const container = new Phaser.GameObjects.Container(this, x, y);
    this.add.existing(container);

    const titleText = new Phaser.GameObjects.Text(this, 0, 0, title, {
      ...getRegularTextProps(),
    });
    let displayScore = 0;
    const scoreText = new Phaser.GameObjects.Text(
      this,
      0,
      50,
      `${displayScore}`,
      getGiantTextProps()
    );

    const medal = new Medal(this, 370, 120, getMedalFromScore(scorePercentage));

    medal.setAlpha(0);
    container.add(titleText);
    container.add(scoreText);
    container.add(medal);
    scoreText.setAlpha(0);

    await fadeIn(this, titleText, 100);
    await fadeIn(this, scoreText, 100);
    await animateToScore(displayScore, score, scoreText);
    await wait(1000);
    if (getMedalFromScore(scorePercentage) === MedalType.platinum) {
      medal.sparkle();
    }
    return await fadeIn(this, medal, 300);
  }

  private renderEnemiesDefeated(score: number, scorePercentage: number) {
    return this.createScoreBox(
      "Rivals defeated",
      score,
      scorePercentage,
      50,
      110
    );
  }
  private renderDamageTaken(score: number, scorePercentage: number) {
    return this.createScoreBox("Damage taken", score, scorePercentage, 50, 310);
  }
  private renderMaxCombo(score: number, scorePercentage: number) {
    return this.createScoreBox("Max combo", score, scorePercentage, 50, 510);
  }

  private async renderOverallScore(completionPercentation: number) {
    const scoreText = new Phaser.GameObjects.Text(
      this,
      50,
      this.game.canvas.height - 180,
      `${0}%`,
      getGiantTextProps()
    );
    scoreText.setAlpha(0);
    this.add.existing(scoreText);
    fadeIn(this, scoreText, 500);

    const overallScore = new Phaser.GameObjects.Text(
      this,
      50,
      this.game.canvas.height - 230,
      "overall score:",
      getRegularTextProps()
    );
    this.add.existing(overallScore);

    await animateToScore(0, completionPercentation, scoreText, 2000);
    scoreText.setText(`${completionPercentation}%`);
  }
  private renderPressSpacebar() {
    const spaceText = new Phaser.GameObjects.Text(
      this,
      500,
      this.game.canvas.height - 150,
      `Press Space`,
      getTitleTextProps()
    );

    this.add.existing(spaceText);
    fadeInOut(this, spaceText);
  }

  setInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.addListener("down", () => {
      this.backToLevelSelect();
    });
  }

  private backToLevelSelect() {
    const state = State.getInstance();
    this.scene.stop("HUDScene");
    this.scene.stop("LevelSelectScene");
    state.resetGame();

    this.scene.start("LevelSelectScene");
  }

  update() {}
}
