import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Antibody extends Phaser.Physics.Arcade.Sprite {
  public dying: boolean = false;

  constructor(scene, x, y) {
    super(scene, x, y, "antibody", 0);

    this.scene.events.on("update", this.update);
    const velocity = Math.max(Math.random() * 300, 100);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "antibody-idle",
      frames: this.anims.generateFrameNumbers("antibody", {
        frames: [0, 1],
      }),
      frameRate: 6,
    });
    this.anims.play("antibody-idle");
    this.setTint(styles.colors.lightGreen);
    this.setVelocityY(velocity);
    setInterval(() => {
      this.angle += 1;
    }, 10);
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
