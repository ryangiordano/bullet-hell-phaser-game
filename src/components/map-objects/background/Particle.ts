import { styles } from "../../../lib/shared";

export default class Particle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "particles", Math.floor(Math.random() * 4));
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setTint(styles.colors.lightGreen);
    this.setAlpha(Math.min(Math.random(), 0.3));
  }
  init() {
    this.setVelocity(0, Math.max(Math.random() * 2000, 1000));
  }
}
