import { MedalType } from "./../systems/LevelScore";
import { getRandomInt } from "../../lib/utility";
import SparkleUp from "../map-objects/misc/SparkleUp";
import { styles } from "../../lib/styles";

export default class MiniMedal extends Phaser.GameObjects.Sprite {
  private sparkleInterval: NodeJS.Timeout;
  constructor(scene: Phaser.Scene, x: number, y: number, medalType: MedalType) {
    super(scene, x, y, "mini-medal", null);
    this.scene.add.existing(this);

    const colorMap = {
      [MedalType.bronze]: styles.colors.white.hex,
      [MedalType.silver]: styles.colors.white.hex,
      [MedalType.gold]: styles.colors.white.hex,
      [MedalType.platinum]: styles.colors.white.hex,
    };
    const frameMap = {
      [MedalType.bronze]: 1,
      [MedalType.silver]: 2,
      [MedalType.gold]: 3,
      [MedalType.platinum]: 4,
    };

    this.setTint(colorMap[medalType] ?? styles.colors.white.hex);
    this.setFrame(frameMap[medalType] ?? 0);
  }
}
