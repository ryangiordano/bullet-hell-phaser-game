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
