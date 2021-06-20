import State from "../game-state/State";
import { styles } from "../lib/shared";
import { wait } from "../lib/utility";

function getRegularTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.darkGreen.string,
    fontSize: "35px",
    fontStyle: "bold",
  };
}
function getTitleTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.darkGreen.string,
    fontSize: "50px",
    fontStyle: "bold",
  };
}
function getGiantTextProps() {
  return {
    fontFamily: "pixel",
    color: styles.colors.darkGreen.string,
    fontSize: "125px",
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

function animateToScore(
  startingScore: number,
  goalScore: number,
  text: Phaser.GameObjects.Text
) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (startingScore >= goalScore) {
        resolve();
        return clearInterval(interval);
      }
      startingScore++;
      text.setText(`${startingScore}`);
    }, 500 / goalScore);
  });
}

export class VictoryScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "VictoryScene" });
  }
  preload() {}

  async init(data) {
    this.setInputs();
    this.add.text(this.game.canvas.width / 5, 10, "Mission Breakdown", {
      ...getTitleTextProps(),
    });
    await this.renderEnemiesDefeated(data.enemiesDefeated);
    await wait(1000);
    await this.renderDamageTaken(data.damageTaken);
    await wait(1000);
    await this.renderMaxCombo(data.maxCombo);
    await wait(1000);
    this.renderAchievement();
    const state = State.getInstance();
    state.saveLevelScoreData({
      levelId: data.levelId,
      maxCombo: data.maxCombo,
      enemiesDefeated: data.enemiesDefeated,
      damageTaken: data.damageTaken,
      totalEnemies: data.totalEnemies,
    });
  }

  async createScoreBox(title: string, score: number, x: number, y: number) {
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
    container.add(titleText);
    container.add(scoreText);
    scoreText.setAlpha(0);
    await fadeIn(this, titleText, 100);
    await fadeIn(this, scoreText, 100);
    return animateToScore(displayScore, score, scoreText);
  }

  renderEnemiesDefeated(score: number) {
    return this.createScoreBox("Rivals defeated", score, 30, 100);
  }
  renderDamageTaken(score: number) {
    return this.createScoreBox("Damage taken", score, 350, 100);
  }
  renderMaxCombo(score: number) {
    return this.createScoreBox("Max combo", score, 690, 100);
  }

  renderAchievement() {}
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
