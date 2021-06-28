import { jiggle } from "../../lib/animation/Animations";
import { getRandomInt } from "../../lib/utility";
import SparkleUp from "../map-objects/misc/SparkleUp";
import { LevelData } from "../../data/levels/LevelRepository";
import { styles } from "../../lib/styles";

function fade(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  duration = 300,
  fromY,
  toY,
  toAlpha,
  fromAlpha
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
        getStart: () => toAlpha,
        getEnd: () => fromAlpha,
      },
      duration: duration,
    });
    timeline.setCallback("onComplete", () => {
      resolve();
    });
    timeline.play();
  });
}

export default class Egg extends Phaser.Physics.Arcade.Sprite {
  public invulnerable: boolean = false;
  public defeated: boolean = false;
  public canAnimate: boolean = true;
  private levelDataVisible: boolean = false;
  private levelDisplayContainer: Phaser.GameObjects.Container;
  constructor(scene, x, y, private levelData: LevelData) {
    super(scene, x, y, "egg", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.anims.create({
      repeat: -1,
      key: "egg-sleep",
      frames: this.anims.generateFrameNumbers("level-egg", {
        frames: [0, 1],
      }),
      frameRate: 3,
    });
    this.levelDisplayContainer = this.scene.add.container(this.x, this.y);
    this.sleep();
    this.body.setCircle(63);
    this.setBounce(1, 1);
    this.setTint(styles.colors.white.hex);
    this.setPushable(false);
    this.setImmovable(true);
  }

  public displayLevelData() {
    if (!this.levelDataVisible) {
      this.levelDataVisible = true;
      const levelName = this.scene.add.text(-60, 70, this.levelData.name, {
        fontStyle: "bold",
        fontSize: "23px",
        color: styles.colors.dark.string,
        fontFamily: "pixel",
      });
      this.levelDisplayContainer.setAlpha(0);
      this.levelDisplayContainer.add(levelName);
      fade(
        this.scene,
        this.levelDisplayContainer,
        100,
        this.y - 50,
        this.y,
        0,
        1
      );
    }
  }

  public async hideLevelData() {
    this.levelDataVisible = false;
    await fade(
      this.scene,
      this.levelDisplayContainer,
      100,
      this.y,
      this.y - 50,
      1,
      0
    );
    this.levelDisplayContainer.removeAll(true);
  }

  async jiggle() {
    if (this.canAnimate) {
      this.canAnimate = false;
      await jiggle(this, this.scene, () => {
        this.canAnimate = true;
      }).play();
    }
  }

  idle() {
    this.setFrame(3);
  }

  sleep() {
    this.anims.play("egg-sleep");
  }
  wake() {
    this.anims.stop();
    this.idle();
  }

  async select() {
    this.jiggle();
  }

  setInvulnerable(invuln: boolean) {
    this.invulnerable = invuln;
  }

  sparkle() {
    const interval = setInterval(() => {
      const x = getRandomInt(this.x * 0.5, this.x * 1.5);
      const y = getRandomInt(this.y * 0.5, this.y * 1.5);
      SparkleUp(this.scene, x, y);
    }, 100);
    return () => {
      clearTimeout(interval);
    };
  }
  update() {}

  getLevelData() {
    return this.levelData;
  }
}
