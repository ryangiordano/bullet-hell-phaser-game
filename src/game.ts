import "phaser";
import State from "./game-state/State";
import { BootScene } from "./scenes/BootScene";
import { LevelScene } from "./scenes/LevelScene";
import { HUDScene } from "./scenes/HUDScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { VictoryScene } from "./scenes/VictoryScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { styles } from "./lib/styles";

const config: Phaser.Types.Core.GameConfig = {
  title: "Baby-2022",
  version: "1.0",
  width: 1000,
  height: 1000,
  zoom: 1,
  type: Phaser.AUTO,
  parent: "game",
  scene: [
    BootScene,
    LevelScene,
    HUDScene,
    GameOverScene,
    VictoryScene,
    LevelSelectScene,
  ],
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  backgroundColor: styles.colors.lightGreen.hex,
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
