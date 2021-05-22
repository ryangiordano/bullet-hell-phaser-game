import { TweenFactory } from "./TweenFactory";

const builder = new TweenFactory();

// ===================================
// Convenience Tweens for building animations
// ===================================
const _scaleUp = (
  target,
  duration = 100,
  from = 1,
  to = 1.1,
  ease = "Linear"
) =>
  builder
    .createTween(target, duration, 0, ease)
    .scaleY(from, to)
    .scaleX(from, to)
    .getConfig();

const scaleDown = (target, duration = 100) =>
  builder
    .createTween(target, duration, 0)
    .scaleY(1, 0.1)
    .scaleX(1, 0.1)
    .fadeOut()
    .getConfig();

const boing = (target) =>
  builder.createTween(target, 50, 0).setYoyo().toY(20).getConfig();

const hover = (target) =>
  builder
    .createTween(target, 300, 0)
    .toY(20)
    .setYoyo()
    .setRepeat(-1)
    .getConfig();

const scaleFadeIn = (target, distance = -80, duration = 100) =>
  builder
    .createTween(target, 0)
    .fadeIn(duration)
    .toY(distance)
    .scaleY(0.1, 1)
    .scaleX(0.1, 1)
    .getConfig();

const fadeOut = (target) =>
  builder.createTween(target, 300, 500).fadeOut().getConfig();

const fadeIn = (target, duration) =>
  builder.createTween(target, 300, 500).fadeIn(duration).getConfig();

// ===================================
// Animations
// ===================================
export const textScaleUp = (
  target,
  delay,
  height = -80,
  scene: Phaser.Scene,
  onComplete
) => {
  const timeline = scene.tweens.createTimeline({
    targets: target,
    ease: "Linear",
    loop: 0,
    delay,
  });
  timeline.add(scaleFadeIn(target, height));
  timeline.add(boing(target));
  timeline.add(fadeOut(target));
  timeline.setCallback("onComplete", onComplete);
  return timeline;
};

export const toXY = (
  target,
  duration: number,
  delay: number,
  x = 50,
  y = 50,
  scene: Phaser.Scene,
  onComplete
) => {
  const timeline = scene.tweens.createTimeline({
    targets: target,
    ease: "Linear",
    loop: 0,
    delay,
    duration,
  });
  timeline.add(
    builder
      .createTween(target, duration, delay)
      .toY(y)
      .toX(x)
      .setRepeat(0)
      .getConfig()
  );
  timeline.setCallback("onComplete", onComplete);
  return timeline;
};
