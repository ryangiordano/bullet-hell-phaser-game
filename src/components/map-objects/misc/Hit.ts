import { styles } from "../../../lib/styles";

export default class Hit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "hit", 0);
    this.scene.add.existing(this);
    const a = this.anims.create({
      repeat: 0,
      key: "hit",
      frames: this.anims.generateFrameNumbers("hit", {
        frames: [2, 3],
      }),
      frameRate: 9,
    });
    this.on("animationcomplete", () => {
      this.destroy();
    });
    this.anims.play({
      key: "hit",
    });

    this.setTint(styles.colors.green.hex);
    this.setAlpha(0.5);
  }
}
