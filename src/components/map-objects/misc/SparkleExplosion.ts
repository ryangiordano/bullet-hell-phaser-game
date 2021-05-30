import { toXY } from "../../../lib/animation/Animations";
import Sparkle from "../misc/Sparkle";

export function SmallSparkleExplosion(
  scene: Phaser.Scene,
  xPos: number,
  yPos: number
) {
  const sparkleExplosion = [{ x: 0, y: 0 }].map(
    ({ x, y }) =>
      new Promise<void>((_resolve) => {
        const s = new Sparkle(scene, xPos, yPos, 25);
        toXY({
          target: s,
          duration: 200,
          delay: 0,
          x,
          y,
          scene: scene,
          onComplete: () => {
            _resolve();
          },
        }).play();
      })
  );
  return Promise.all(sparkleExplosion);
}

export default async function SparkleExplosion(
  scene: Phaser.Scene,
  xPos: number,
  yPos: number
) {
  const sparkleExplosion = [
    { x: 0, y: -600 },
    { x: 0, y: 600 },
    { x: 600, y: 0 },
    { x: -600, y: 0 },
  ].map(
    ({ x, y }) =>
      new Promise<void>((_resolve) => {
        const s = new Sparkle(scene, xPos, yPos, 24);
        toXY({
          target: s,
          duration: 1000,
          delay: 0,
          x,
          y,
          scene: scene,
          onComplete: () => {
            s.destroy();
            _resolve();
          },
        }).play();
      })
  );
  return Promise.all(sparkleExplosion);
}
