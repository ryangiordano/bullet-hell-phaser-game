import { styles } from "../../../lib/styles";

export default class ShockWave extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    frameRate = 9,
    size: number = 1,
    speed: number = 300,
    completeCallback?: () => void
  ) {
    super(scene, x, y, "critical", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: 0,
      key: "shockwave-animate",
      frames: this.anims.generateFrameNumbers("critical", {
        frames: [5, 4, 3, 2, 1, 0],
      }),
      frameRate,
    });
    this.on("animationcomplete", () => {
      completeCallback?.();
    });
    this.anims.play({
      key: "shockwave-animate",
    });
    this.body.setCircle(65);
    this.setTint(styles.colors.normal.hex);
    this.setAlpha(0.7);
    setTimeout(() => {
      this.scaleIn(size, speed);
    }, 300);
  }

  scaleIn(size: number = 1, speed) {
    const timeline = this.scene.tweens.createTimeline({
      targets: this,
      ease: "Cubic",
      loop: 0,
    });
    timeline.add({
      targets: this,
      scaleX: {
        getStart: () => 0.5,
        getEnd: () => size,
      },
      scaleY: {
        getStart: () => 0.5,
        getEnd: () => size,
      },
      duration: speed,
    });

    timeline.add({
      targets: this,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
      duration: 500,
    });
    timeline.setCallback("onComplete", () => {
      this.destroy();
    });
    timeline.play();
  }
}
