import { styles } from "../../../lib/styles";

export default class Planet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "planet");
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setTint(styles.colors.white.hex);
  }
  init() {}
}
