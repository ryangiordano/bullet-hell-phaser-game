import { scaleOut } from "./../../../lib/animation/Animations";
import { getKnockbackVector, spasm } from "../../../lib/shared";
import { SmallSparkleExplosion } from "../misc/SparkleExplosion";
import { styles } from "../../../lib/styles";
import { getRandomBetween, getRandomInt, wait } from "../../../lib/utility";
import Enemy from "./Enemy";

function shiver(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
  duration: number = 100,
  repeat?: number
) {
  return new Promise<void>((resolve) => {
    const timeline = scene.tweens.createTimeline({
      targets: target,
      loop: 0,
    });

    timeline.add({
      targets: target,
      repeat: repeat ?? -1,
      yoyo: true,
      scale: {
        getStart: () => 1,
        getEnd: () => 1.2,
      },

      duration,
    });

    timeline.setCallback("onComplete", () => {
      resolve();
    });

    timeline.play();
  });
}

export class CovidBarb extends Enemy {
  public invulnerable = true;
  constructor(scene, x, y, velocity: { x: number; y: number }) {
    super(scene, x, y, "covid", 5);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setVelocity(velocity.x, velocity.y);
    this.setTint(styles.colors.light.hex);
    this.body.setCircle(10, 55, 55);
  }
  kill() {
    return new Promise<void>((resolve) => resolve());
  }
}

export default class Covid extends Enemy {
  public dying: boolean = false;
  public health: number = 2;
  public invulnerable: boolean = false;
  private meanderInterval: NodeJS.Timeout | null = null;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private addToGroup: (e: Phaser.Physics.Arcade.Sprite) => void
  ) {
    super(scene, x, y, "covid", 0);
    this.deathFrame = 4;
    this.setVelocityY(150);

    this.scene.events.on("destroy", () => {
      clearInterval(this.meanderInterval);
    });

    this.setTint(styles.colors.light.hex);
    this.body.setCircle(45, 20, 20);
    this.anims.create({
      repeat: -1,
      key: "bare",
      frames: this.anims.generateFrameNumbers("covid", {
        frames: [3, 4],
      }),
      frameRate: 9,
    });

    this.anims.create({
      repeat: -1,
      key: "idle",
      frames: this.anims.generateFrameNumbers("covid", {
        frames: [0, 1],
      }),
      frameRate: 3,
    });
    this.anims.play("idle");
    setTimeout(async () => {
      this.anims.stop();
      this.setFrame(2);
      this.setVelocity(0);
      await shiver(this.scene, this, 100, 10);
      this.fire();
      await wait(1000);
      this.meander();
    }, 5000);

    this.scene.events.on("update", () => {
      this.update();
    });
  }

  fire() {
    const veloMap = {
      0: { x: 0, y: -250 },
      1: { x: -250, y: -250 },
      2: { x: 250, y: -250 },
      3: { x: 250, y: 250 },
      4: { x: -250, y: 250 },
    };
    for (let i = 0; i < 5; i++) {
      const b = new CovidBarb(this.scene, this.x, this.y, veloMap[i]);
      this.addToGroup(b);
    }
    this.anims.play("bare");
  }

  meander() {
    const setMeanderVelo = () => {
      if (!this) {
        return this.clearMeander();
      }
      this.setVelocity(
        getRandomInt(0, 1) ? -100 : 100,
        getRandomInt(0, 1) ? -100 : 100
      );
    };

    setMeanderVelo();
    this.meanderInterval = setInterval(() => {
      if (this) {
        setMeanderVelo();
      } else {
        this.clearMeander();
      }
    }, 3000);
  }

  clearMeander() {
    clearInterval(this.meanderInterval);
  }

  protected async onDamage() {
    this.anims.stop();
    shiver(this.scene, this, 10, 10);
    const dmgFrame = this.meanderInterval === null ? 6 : 4;
    this.setFrame(dmgFrame);
    setTimeout(() => {
      this.anims.play(this.meanderInterval === null ? "idle" : "bare");
    }, this.invulnerableDuration);
  }
}
