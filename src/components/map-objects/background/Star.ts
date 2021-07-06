import { styles } from "../../../lib/styles";
import { getRandomBetween } from "../../../lib/utility";
function shimmer(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
) {
  return new Promise<void>((resolve) => {
    const timeline = scene.tweens.createTimeline({
      targets: target,
      loop: 0,
    });
    timeline.add({
      targets: target,
      repeat: -1,
      yoyo: true,
      scale: {
        getStart: () => 0.5,
        getEnd: () => 1,
      },
      alpha: {
        getStart: () => 0.1,
        getEnd: () => 0.5,
      },
      duration: getRandomBetween(750, 3000),
    });
    timeline.setCallback("onComplete", () => {
      resolve();
    });
    timeline.play();
  });
}
export default class Star extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "star", Math.floor(Math.random() * 4));
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setTint(styles.colors.white.hex);

    shimmer(this.scene, this);
  }
}
