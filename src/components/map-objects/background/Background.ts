import { styles } from "../../../lib/shared";

export default class Background extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "background", 0);
    this.scene.add.existing(this);
    this.setScale(0.9, 40);
    this.setAlpha(0.8);
    this.setTint(styles.colors.lightGreen.hex);
  }
}
