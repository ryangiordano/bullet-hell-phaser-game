import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "enemy-idle",
      frames: this.anims.generateFrameNumbers("enemy", {
        frames: [0, 1, 2, 3, 4, 3, 2, 1],
      }),
      frameRate: 18,
    });
    this.anims.play("enemy-idle");
    this.setTint(styles.colors.green);
    this.init();
  }

  public dying: boolean = false;

  init() {
    this.setVelocityY(-100);
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
