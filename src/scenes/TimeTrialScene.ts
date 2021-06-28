import Egg from "../components/map-objects/Egg";
import Antibody from "../components/map-objects/enemies/Antibody";
import Enemy from "../components/map-objects/enemies/Enemy";
import State from "../game-state/State";
import { toXY } from "../lib/animation/Animations";
import { styles } from "../lib/styles";
import { LevelScene } from "./LevelScene";

export default class TimeTrialScene extends LevelScene {
  private antibodyInterval: NodeJS.Timeout;
  private enemyInterval: NodeJS.Timeout;
  private finishLineTimeout: NodeJS.Timeout;
  constructor() {
    super({ key: "TimeTrialScene" });
  }

  protected postInit() {
    this.addCompetition();
    this.addAntibodies();
  }

  private addAntibodies() {
    this.antibodyInterval = setInterval(() => {
      this.antibodies.add(
        new Antibody(this, Math.random() * this.game.canvas.width, -200)
      );
    }, 3000);
  }

  private addCompetition() {
    this.enemyInterval = setInterval(() => {
      this.enemies.add(
        new Enemy(
          this,
          Math.random() * this.game.canvas.width,
          this.game.canvas.height + 50
        )
      );
    }, 1000);
  }

  /** After 20 seconds, the finish line descends and ends the game */
  private setFinish() {
    this.finishLineTimeout = setTimeout(() => {
      this.stopSpawningObstacles();
      const egg = new Egg(this, this.game.canvas.width / 2, -100);
      const anim = toXY({
        target: egg,
        duration: 4000,
        delay: 0,
        x: 0,
        y: this.game.canvas.height / 2,
        scene: this,
        ease: "Expo.easeOut",
        onComplete: () => {
          this.boundaryCollide.add(egg);
        },
      });

      this.physics.add.collider(egg, this.hero, () => {
        const state = State.getInstance();
        if (this.hero.charging) {
          if (!state.getLevelComplete()) {
            egg.setVelocity(0, 0);
            this.add.text(450, this.game.canvas.height / 2, "GOAL", {
              fontFamily: "pixel",
              color: styles.colors.dark.string,
              fontSize: "50px",
              fontStyle: "bold",
            });
            this.scene.pause();
            this.scene.stop("HUDScene");
            setTimeout(() => {
              this.scene.stop();
              this.scene.start("VictoryScene");
            }, 2000);
          }
        }
      });
      anim.play();
    }, 60000);
  }

  protected stopSpawningObstacles() {
    clearTimeout(this.antibodyInterval);
    clearTimeout(this.particleInterval);
    clearTimeout(this.enemyInterval);
    clearTimeout(this.finishLineTimeout);
  }
}
