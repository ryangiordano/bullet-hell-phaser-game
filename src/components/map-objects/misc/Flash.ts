import { styles } from "../../../lib/shared";

export default class Flash extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "flash", 0);
    this.scene.add.existing(this);
    this.setTint(styles.colors.white.hex);
  }
}
