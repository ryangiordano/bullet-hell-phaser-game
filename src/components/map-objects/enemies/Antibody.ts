import { jiggle } from "../../../lib/animation/Animations";
import { getKnockbackVector } from "../../../lib/shared";
import { styles } from "../../../lib/styles";

export default class Antibody extends Phaser.Physics.Arcade.Sprite {
  public dying: boolean = false;

  constructor(scene, x, y, velocity?: number) {
    super(scene, x, y, "antibody", 0);

    this.scene.events.on("update", this.update);
    velocity = velocity ?? Math.max(Math.random() * 300, 100);
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
    this.setTint(styles.colors.light.hex);
    this.setVelocityY(velocity);
    this.body.setCircle(128);

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
  jiggle() {
    jiggle(this, this.scene, () => {}).play();
  }
}
