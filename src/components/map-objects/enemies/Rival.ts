import { scaleOut } from "../../../lib/animation/Animations";
import { getKnockbackVector, spasm } from "../../../lib/shared";
import { SmallSparkleExplosion } from "../misc/SparkleExplosion";
import { styles } from "../../../lib/styles";
import Enemy from "./Enemy";

export default class Rival extends Enemy {
  public dying: boolean = false;
  public health: number = 1;
  public invulnerable: boolean = false;
  constructor(scene: Phaser.Scene, x: number, y: number, velocity?: number) {
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
    this.setTint(styles.colors.light.hex);
    this.setVelocityY(-velocity);
    this.body.setSize(50, 100);
  }
}
