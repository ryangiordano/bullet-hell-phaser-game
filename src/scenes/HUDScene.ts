import { HeadsUpDisplay } from "../components/hud/HeadsUpDisplay";

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: "HUDScene" });
  }
  preload() {}

  init() {
    const hud = new HeadsUpDisplay(this, 50, this.game.canvas.height-50);
    this.add.existing(hud);
  }

  update() {}
}
