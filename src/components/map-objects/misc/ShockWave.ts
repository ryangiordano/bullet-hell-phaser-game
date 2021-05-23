import { styles } from "../../../lib/shared";

export default class Sparkle extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, frameRate = 9, completeCallback: () => void) {
    super(scene, x, y, "critical", 0);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: 0,
      key: "critical-animate",
      frames: this.anims.generateFrameNumbers("critical", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      }),
      frameRate,
    });
    this.on("animationcomplete", () => {
      completeCallback?.();
      this.destroy();
    });
    this.anims.play({
      key: "critical-animate",
    });

    this.setTint(styles.colors.green.hex);
    this.setScale(3);
    this.setAlpha(0.7);
  }
}
