import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  public dying: boolean = false;

  constructor(scene, x, y) {
    super(scene, x, y, "enemy", 0);
    const velocity = Math.max(Math.random() * 300, 100);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "enemy-idle",
      frames: this.anims.generateFrameNumbers("enemy", {
        frames: [0, 1, 2, 3, 4, 3, 2, 1],
      }),
      frameRate: velocity / 10,
    });
    this.anims.play("enemy-idle");
    this.setTint(styles.colors.lightGreen.hex);
    this.setVelocityY(-velocity);
    this.body.setSize(50, 100);
  }

  kill() {
    if (this.dying) {
      return;
    }
    this.dying = true;
    const { x, y } = getKnockbackVector(this.body, 400);
    this.setVelocity(x, y);
    setTimeout(() => {
      this.destroy();
    }, 200);
  }
}
