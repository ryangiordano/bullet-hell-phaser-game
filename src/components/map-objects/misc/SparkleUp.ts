import { toXY } from "../../../lib/animation/Animations";
import Sparkle from "../misc/Sparkle";
import Flash from "./Flash";

export default async function SparkleUp(
  scene: Phaser.Scene,
  xPos: number,
  yPos: number
) {
  const sparkleUp = new Promise<void>((_resolve) => {
    const s = new Flash(scene, xPos, yPos);
    const sparkle = setInterval(() => {
      s.setAlpha(s.alpha === 1 ? 0.5 : 1);
    }, 50);

    const timeline = scene.tweens.createTimeline({
      targets: s,
      ease: "Cubic",
      loop: 0,
    });
    timeline.add({
      targets: s,
      x: xPos,
      y: yPos - 500,
      scaleX: {
        getEnd: () => 0,
      },
      scaleY: {
        getEnd: () => 0,
      },
      duration: 1000,
      onComplete: () => {
        clearInterval(sparkle);
        s.destroy();
        _resolve();
      },
    });
    return timeline.play();
  });

  return sparkleUp;
}
