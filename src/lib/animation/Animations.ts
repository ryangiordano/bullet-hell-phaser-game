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

const _spinScaleIn = (
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
    .rotate()
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

export const scaleIn = (target, scene: Phaser.Scene, onComplete) => {
  const timeline = scene.tweens.createTimeline({
    targets: target,
    ease: "Cubic",
    loop: 0,
  });
  timeline.add({
    targets: target,
    x: 100,
    y: 100,
    scaleX: {
      getStart: () =>.5,
      getEnd: () =>.5,
    },
    scaleY: {
      getStart: () =>.5,
      getEnd: () =>.5,
    },
    duration: 300
  });
  timeline.add({
    targets: target,
    ease: "Cubic",
    scaleX: {
      getStart: () => 0,
      getEnd: () => 1.5,
    },
    scaleY: {
      getStart: () => 0,
      getEnd: () => 1.5,
    },
    alpha: {
      getStart: () => 0,
      getEnd: () => 1,
    },
    duration: 200,
  });
  timeline.add({
    targets: target,
    alpha: {
      getStart: () => 1,
      getEnd: () => 1,
    },
    duration: 1000,
  });
  timeline.add({
    targets: target,
    alpha: {
      getStart: () => 1,
      getEnd: () => 0,
    },
    scaleX: {
      getStart: () => 1.5,
      getEnd: () => 0,
    },
    scaleY: {
      getStart: () => 1.5,
      getEnd: () => 0,
    },
    duration: 500,
  });
  timeline.setCallback("onComplete", onComplete);
  return timeline;
};

export const toXY = ({
  target,
  duration,
  delay,
  x = 50,
  y = 50,
  scene,
  ease,
  onComplete,
}: {
  target: any;
  duration: number;
  delay: number;
  x: number;
  y: number;
  ease?: string;
  scene: Phaser.Scene;
  onComplete: () => void;
}) => {
  const timeline = scene.tweens.createTimeline({
    targets: target,
    ease: ease || "Linear",
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
