import { scaleOut } from "./../../../lib/animation/Animations";
import { styles, getKnockbackVector, spasm } from "../../../lib/shared";
import { SmallSparkleExplosion } from "../misc/SparkleExplosion";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  public dying: boolean = false;

  constructor(scene, x, y, velocity?: number) {
    super(scene, x, y, "enemy", 0);
    velocity = velocity ?? Math.max(Math.random() * 300, 100);
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

  async kill() {
    if (this.dying) {
      return;
    }
    spasm(this);
    this.anims.stop();
    this.setFrame(5);
    this.dying = true;
    const { x, y } = getKnockbackVector(this.body, 400);
    this.setVelocity(x, y);
    const s = new Promise<void>((resolve) => {
      const an = scaleOut(this, this.scene, () => resolve());
      an.play();
    });
    await s;
    SmallSparkleExplosion(this.scene, this.x, this.y);
    this.destroy();
  }
}
