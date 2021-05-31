import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Boundary extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    xPosition: number,
    yPosition: number,
    private sizeX: number,
    private sizeY: number
  ) {
    super(scene, xPosition, yPosition, null);
  }
  init() {
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.body.setSize(this.sizeX, this.sizeY);
    this.setAlpha(0);
  }
}
