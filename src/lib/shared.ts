export const styles = {
  colors: {
    white: 0xffffff,
    black: 0x1f1f1f,
    darkGreen: 0x4c513b,
    green: 0x89946a,
    lightGreen: 0xc4cfa1,
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
