import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Boundary extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    xPosition: number,
    yPosition: number,
    private sizeX,
    private sizeY
  ) {
    super(scene, xPosition, yPosition, null);
  }
  init() {
    this.body.setSize(this.sizeX, this.sizeY);
    this.setAlpha(0);
  }
}
