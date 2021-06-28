import Boundary from "../components/map-objects/background/Boundary";
import Flash from "../components/map-objects/misc/Flash";
import { scaleIn } from "./animation/Animations";
import { styles } from "./styles";

export function getKnockbackVector(
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
  severity: number
) {
  const knockbackVector = { x: 0, y: 0 };
  if (body.touching.down) {
    knockbackVector.y = -severity;
  }
  if (body.touching.up) {
    knockbackVector.y = severity;
  }
  if (body.touching.right) {
    knockbackVector.x = -severity;
  }
  if (body.touching.left) {
    knockbackVector.x = severity;
  }
  return knockbackVector;
}

export function spasm(
  target: Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite
) {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      target.setX(target.x + Math.random() * 25 * (i % 2 ? -1 : 1));
      target.setY(target.y + Math.random() * 25 * (i % 2 ? -1 : 1));
    }, i * 25);
  }
}

/** Animate combo visual */
export function animateCombo(
  x: number,
  y: number,
  combo: number,
  scene: Phaser.Scene
) {
  if (combo % 5 === 0 || combo >= 20) {
    const c = new Phaser.GameObjects.Container(scene, x, y);
    scene.add.existing(c);

    const f = new Flash(scene, 0, 0);
    const text = new Phaser.GameObjects.Text(scene, -12, -15, `${combo}`, {
      fontSize: "25px",
      fontStyle: "bold",
      fontFamily: "pixel",
      color: styles.colors.green.string,
      wordWrap: {
        width: 100,
      },
    });
    text.setAlign("center");
    c.add(f);
    c.add(text);

    const tl = scaleIn(c, scene, () => {
      f.destroy();
    });
    tl.play();
  }
}

export function setWorldBounds(scene: Phaser.Scene) {
  const height = scene.game.canvas.height;
  const width = scene.game.canvas.width;

  const left = new Boundary(scene, -250, height / 2, 500, height * 2);
  const right = new Boundary(scene, width + 250, height / 2, 500, height * 2);
  const top = new Boundary(scene, width / 2, -250, width * 2, 500);
  const bottom = new Boundary(scene, width / 2, height + 250, width * 2, 500);

  const boundaryStaticGroup = new Phaser.Physics.Arcade.StaticGroup(
    scene.physics.world,
    scene,
    [left, right, top, bottom]
  );

  left.init();
  right.init();
  top.init();
  bottom.init();

  return boundaryStaticGroup;
}
