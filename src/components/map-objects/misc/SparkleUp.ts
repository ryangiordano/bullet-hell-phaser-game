import Flash from "./Flash";

export default async function SparkleUp(
  scene: Phaser.Scene,
  xPos: number,
  yPos: number,
  scale: number = 1,
  distance: number = 500
) {
  const sparkleUp = new Promise<void>((_resolve) => {
    const s = new Flash(scene, xPos, yPos);
    s.setScale(scale);
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
      y: yPos - distance,
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
