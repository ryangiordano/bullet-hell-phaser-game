import { scaleOut } from "../../../lib/animation/Animations";
import { getKnockbackVector, spasm } from "../../../lib/shared";
import { SmallSparkleExplosion } from "../misc/SparkleExplosion";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  public dying: boolean = false;
  public health: number = 1;
  public invulnerable: boolean = false;
  protected invulnerableDuration: number = 750;
  protected deathFrame: number = 5;
  protected onDamage() {
    return;
  }
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    sprite: string,
    frame: number
  ) {
    super(scene, x, y, sprite, frame);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
  }

  public damage() {
    if (this.invulnerable) {
      return;
    }
    this.onDamage?.();
    this.invulnerable = true;
    this.health--;
    if (this.health <= 0) {
      this.kill();
    } else {
      setTimeout(() => {
        this.invulnerable = false;
      }, this.invulnerableDuration);
    }
  }

  public knockBack(severity: number) {
    const { x, y } = getKnockbackVector(this.body, severity);
    this.setVelocity(x, y);
  }

  async kill() {
    if (this.dying) {
      return;
    }
    spasm(this);
    this.anims.stop();
    this.setFrame(this.deathFrame);
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
