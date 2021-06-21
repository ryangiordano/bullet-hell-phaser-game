import { MedalType } from "./../systems/LevelScore";
import { styles } from "./../../lib/shared";
import { getRandomInt } from "../../lib/utility";
import SparkleUp from "../map-objects/misc/SparkleUp";

export default class Medal extends Phaser.GameObjects.Sprite {
  private sparkleInterval: NodeJS.Timeout;
  constructor(scene: Phaser.Scene, x: number, y: number, medalType: MedalType) {
    super(scene, x, y, "medal", medalType);
    this.scene.add.existing(this);
    this.setFrame(medalType);
    this.setTint(styles.colors.lightGreen.hex);
    this.scene.events.once("shutdown", () => {
      clearInterval(this.sparkleInterval);
    });
  }

  sparkle() {
    this.sparkleInterval = setInterval(() => {
      const spriteX = this.parentContainer.x + this.x;
      const spriteY = this.parentContainer.y + this.y;
      const x = getRandomInt(spriteX * 0.8, spriteX * 1.2);
      const y = getRandomInt(spriteY * 0.8, spriteY * 1.2);
      SparkleUp(this.scene, x, y, 0.5, 100);
    }, 500);
  }
}
