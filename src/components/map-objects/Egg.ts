import { jiggle } from "../../lib/animation/Animations";
import { styles } from "../../lib/shared";
import { asyncForEach, getRandomInt, wait } from "../../lib/utility";
import ShockWave from "./misc/ShockWave";
import SparkleExplosion from "./misc/SparkleExplosion";
import SparkleUp from "./misc/SparkleUp";

export default class Egg extends Phaser.Physics.Arcade.Sprite {
  private hp: number = 3;
  public invulnerable: boolean = false;
  public defeated: boolean = false;
  constructor(scene, x, y) {
    super(scene, x, y, "egg", 0);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.create({
      repeat: -1,
      key: "egg-idle",
      frames: this.anims.generateFrameNumbers("egg", {
        frames: [0, 1],
      }),
      frameRate: 3,
    });
    this.anims.create({
      repeat: -1,
      key: "egg-sleep",
      frames: this.anims.generateFrameNumbers("egg", {
        frames: [3, 4, 5, 4],
      }),
      frameRate: 3,
    });
    this.sleep();
    this.body.setCircle(255);
    this.setBounce(1, 1);
    this.setTint(styles.colors.white.hex);
    this.setPushable(false);
  }

  jiggle() {
    jiggle(this, this.scene, () => {}).play();
  }

  idle() {
    this.anims.play("egg-idle");
  }

  sleep() {
    this.anims.play("egg-sleep");
  }
  wake() {
    this.anims.stop();
    this.setFrame(6);
  }

  async takeDamage() {
    this.jiggle();
    this.hp = Math.max(this.hp - 1, 0);
    if (this.hp === 0) {
      this.defeated = true;
      await this.defeat();
    } else {
      await this.flashDamage(10);
    }
  }

  setInvulnerable(invuln: boolean) {
    this.invulnerable = invuln;
  }

  sparkle() {
    const interval = setInterval(() => {
      const x = getRandomInt(this.x * 0.5, this.x * 1.5);
      const y = getRandomInt(this.y * 0.5, this.y * 1.5);
      SparkleUp(this.scene, x, y);
    }, 100);
    return () => {
      clearTimeout(interval);
    };
  }

  async flashDamage(intensity: number = 4) {
    this.setInvulnerable(true);
    this.wake();
    let flashCount = 0;
    await asyncForEach(
      new Array(intensity).fill(null).map(() => {
        return () =>
          new Promise<void>((resolve) => {
            this.setTint(
              flashCount % 2 === 0
                ? styles.colors.lightGreen.hex
                : styles.colors.white.hex
            );
            setTimeout(() => {
              flashCount++;
              resolve();
            }, 50);
          });
      }),
      async (p) => {
        await p();
      }
    );
    this.setInvulnerable(false);
    this.sleep();
  }

  async defeat() {
    await this.flashDamage(40);
    this.wake();
    await this.explosions(60);
    new ShockWave(this.scene, this.x, this.y, 9, 7, 1000);
  }

  //TODO: Refactor
  private async explosions(numberOfExplosions = 4) {
    await asyncForEach(
      new Array(numberOfExplosions).fill(null).map(() => {
        const x = getRandomInt(this.x * 0.5, this.x * 1.5);
        const y = getRandomInt(this.y * 0.5, this.y * 1.5);
        return () =>
          new Promise<void>((resolve) => {
            SparkleExplosion(this.scene, x, y);
            setTimeout(() => {
              resolve();
            }, 50);
          });
      }),
      async (p) => {
        await p();
      }
    );
  }
}
