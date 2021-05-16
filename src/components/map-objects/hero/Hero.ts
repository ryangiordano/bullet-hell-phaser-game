import { styles } from "../../../lib/shared";

export default class Hero extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private invuln: boolean = false;
  constructor(scene, x, y) {
    super(scene, x, y, "hero", 0);
    this.scene.add.existing(this);
    this.setInputs();
    this.anims.create({
      repeat: -1,
      key: "hero-idle",
      frames: this.anims.generateFrameNumbers("hero", {
        frames: [0, 1, 2, 3, 4, 3, 2, 1],
      }),
      frameRate: 18,
    });
    this.anims.play("hero-idle");
    this.setTint(styles.colors.lightGreen);
  }

  init() {
    const b: any = this.body;
    b?.setDrag(500, 500);
    b?.setMaxVelocity(400, 400);
    this.body.setSize(50, 50);
  }

  private stopMovement() {
    if (this.noCursorsDown()) {
      this.setAccelerationY(0);
      this.setAccelerationX(0);
    }
  }
  private noCursorsDown() {
    return (
      !this.cursors.down.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown
    );
  }

  private flashing() {
    return setInterval(() => {
      this.setAlpha(this.alpha === 1 ? 0.5 : 1);
    }, 15);
  }

  private setInvulnerable() {
    this.invuln = true;
    const flashingInterval = this.flashing();

    setTimeout(() => {
      this.invuln = false;
      clearInterval(flashingInterval);
      this.setAlpha(1);
    }, 2000);
  }

  public getHurt() {
    if (!this.invuln) {
      this.setInvulnerable();

      if (this.body.touching.down) {
        this.setVelocity(0, -1000);
      }
      if (this.body.touching.up) {
        this.setVelocity(0, 1000);
      }
      if (this.body.touching.right) {
        console.log("Hitting right");
        this.setVelocity(-1000, 0);
      }
      if (this.body.touching.left) {
        this.setVelocity(1000, 0);
      }
    }
  }

  private setInputs() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.cursors.down.addListener("down", () => {
      this.setAccelerationY(1000);
    });
    this.cursors.down.addListener("up", () => this.stopMovement());

    this.cursors.up.addListener("down", () => {
      this.setAccelerationY(-1000);
    });
    this.cursors.up.addListener("up", () => this.stopMovement());

    this.cursors.left.addListener("down", () => {
      this.setAccelerationX(-1000);
    });
    this.cursors.left.addListener("up", () => this.stopMovement());

    this.cursors.right.addListener("down", () => {
      this.setAccelerationX(1000);
    });
    this.cursors.right.addListener("up", () => this.stopMovement());
  }
}
