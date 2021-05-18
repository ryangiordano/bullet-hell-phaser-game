import { styles } from "../../lib/shared";

export default class Egg extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "egg", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "egg-idle",
      frames: this.anims.generateFrameNumbers("egg", {
        frames: [0, 1],
      }),
      frameRate: 10,
    });
    this.anims.play("egg-idle");
    this.setTint(styles.colors.lightGreen);
  }
}