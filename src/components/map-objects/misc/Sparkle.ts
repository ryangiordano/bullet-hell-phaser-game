import { styles } from "../../../lib/styles";

export default class Sparkle extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, frameRate = 9, small?: boolean) {
    super(scene, x, y, "sparkle", 0);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: 0,
      key: "sparkle-animate",
      frames: this.anims.generateFrameNumbers("sparkle", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      }),
      frameRate,
    });

    this.anims.create({
      repeat: 0,
      key: "sparkle-small-animate",
      frames: this.anims.generateFrameNumbers("sparkle", {
        frames: [0, 1, 2, 3],
      }),
      frameRate,
    });

    this.on("animationcomplete", () => {
      this.destroy();
    });
    this.anims.play({
      key: small ? "sparkle-small-animate" : "sparkle-animate",
    });

    this.setTint(styles.colors.normal.hex);
    this.setAlpha(0.5);
  }
}
