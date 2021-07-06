import { jiggle } from "../../lib/animation/Animations";
import { getRandomInt } from "../../lib/utility";
import SparkleUp from "../map-objects/misc/SparkleUp";
import { LevelData } from "../../data/levels/LevelRepository";
import { styles } from "../../lib/styles";
import { getHighScore } from "../../game-state/SaveState";

export default class LevelEgg extends Phaser.Physics.Arcade.Sprite {
  public invulnerable: boolean = false;
  public defeated: boolean = false;
  public canAnimate: boolean = true;
  private levelDataVisible: boolean = false;
  private levelDisplayContainer: Phaser.GameObjects.Container;
  private levelData: LevelData;
  constructor(scene, x, y, levelData: LevelData) {
    super(scene, x, y, "egg", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.anims.create({
      repeat: -1,
      key: "egg-sleep",
      frames: this.anims.generateFrameNumbers("level-egg", {
        frames: [0, 1, 2, 1],
      }),
      frameRate: 3,
    });
    this.levelDisplayContainer = this.scene.add.container(this.x, this.y);
    this.sleep();
    this.body.setCircle(40, 25, 25);
    this.setBounce(1, 1);
    this.setTint(styles.colors.white.hex);
    this.setPushable(false);
    this.setImmovable(true);

    this.levelData = {
      ...levelData,
      levelScoreData: getHighScore(levelData.id),
    };
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
