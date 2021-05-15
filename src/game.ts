import "phaser";
import State from "./game-state/State";
import { BootScene } from "./scenes/BootScene";
import { MainScene } from "./scenes/MainScene";
import { HUDScene } from "./scenes/HUDScene";
import { styles } from "./lib/shared";

const config: Phaser.Types.Core.GameConfig = {
  title: "Baby-2022",
  version: "1.0",
  width: 1000,
  height: 1000,
  zoom: 1,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, MainScene, HUDScene],
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: styles.colors.lightGreen,
  render: { pixelArt: false, antialias: true },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
