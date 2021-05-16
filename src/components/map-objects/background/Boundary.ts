import { styles, getKnockbackVector } from "../../../lib/shared";

export default class Boundary extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, private sizeX, private sizeY) {
    super(scene, x, y, null);

  }
  init(){
    this.body.setSize(this.sizeX, this.sizeY);
    this.setAlpha(0);
  }
}
