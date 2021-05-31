import Flash from "../components/map-objects/misc/Flash";
import { scaleIn } from "./animation/Animations";

export const styles = {
  colors: {
    white: {
      string: "#e3ead7",
      hex: 0xe3ead7,
    },
    black: {
      string: "#1f1f1f",
      hex: 0x1f1f1f,
    },
    darkGreen: {
      string: "#4c513b",
      hex: 0x4c513b,
    },
    green: {
      string: "#89946a",
      hex: 0x89946a,
    },
    lightGreen: {
      string: "#c4cfa1",
      hex: 0xc4cfa1,
    },
  },
};

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
