import { styles } from "../../../lib/shared";

export default class Health extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "health", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "health-idle",
      frames: this.anims.generateFrameNumbers("health", {
        frames: [0, 1, 2, 1],
      }),
      frameRate: 6,
    });
    this.anims.play("health-idle");
    this.setTint(styles.colors.lightGreen);
    this.setVelocityY(-40);
  }
}
