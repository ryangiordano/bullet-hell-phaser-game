import { HeadsUpDisplay } from "../components/hud/HeadsUpDisplay";

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: "HUDScene" });
  }
  preload() {}

  init() {
    const hud = new HeadsUpDisplay(this, 50, 50);
    this.add.existing(hud);

    this.events.on("destroy", () => {});
  }

  beforeDestroy() {}

  update() {}
}
