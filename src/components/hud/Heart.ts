import { styles } from "../../lib/shared";

export default class Heart extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "heart-small", 0);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "heart-beat",
      frames: this.anims.generateFrameNumbers("heart-small", {
        frames: [0, 1, 2, 1],
      }),
      frameRate: 9,
    });

    this.setTint(styles.colors.lightGreen);
    this.setAlpha(0.8);
    // this.init();
    this.anims.play("heart-beat");
  }
}
