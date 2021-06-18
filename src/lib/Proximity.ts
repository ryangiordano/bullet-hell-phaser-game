/** Create proximity ring */
function createProximity({
  scene,
  x,
  y,
  size,
}: {
  scene: Phaser.Scene;
  x: number;
  y: number;
  size: number;
}) {
  const proximity = new Phaser.Physics.Arcade.Sprite(scene, x, y, null);
  proximity.setAlpha(0);
  scene.physics.add.existing(proximity);
  proximity.setOrigin(4 * size, 4 * size);
  proximity.body.setCircle(126 * size);

  return proximity;
}

/** Create the proximity ring that will shadow the objectWithProximity.
 * Any objectDetected that enter the ring will trigger a callback
 * Likewise, any objectDetected that leaves will trigger a callback
 */
export function withProximity({
  scene,
  objectWithProximity,
  groupToDetect,
  onEnter,
  onLeave,
  size = 1,
}: {
  scene: Phaser.Scene;
  objectWithProximity: Phaser.Physics.Arcade.Sprite;
  groupToDetect: Phaser.GameObjects.Group;
  onEnter: (
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => void;
  onLeave: (
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => void;
  size?: number;
}) {
  /** Create the proximity ring and center it on the objectWithProximity */
  const proximity = createProximity({
    x: objectWithProximity.x,
    y: objectWithProximity.y,
    scene,
    size,
  });

  /** Check the overlap of objects with proximity */
  scene.physics.add.overlap(proximity, groupToDetect, (_, objectDetected) =>
    checkProximityEnter(objectDetected)
  );

  /** Fire off when we detect an overlap */
  function checkProximityEnter(objectDetected) {
    if (!objectDetected["isInProximity"]) {
      objectDetected["isInProximity"] = true;
      onEnter(objectWithProximity, objectDetected);
    }
  }

  /** Fire off repeatedly in update to check if the object is colliding with the proximity any longer */
  function checkProximityLeave(
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Physics.Arcade.Sprite
  ) {
    if (
      objectDetected["isInProximity"] &&
      !scene.physics.overlap(proximity, objectDetected)
    ) {
      onLeave(objectWithProximity, objectDetected);
      objectDetected["isInProximity"] = false;
    }
  }

  /** Make the proximity ring shadow the objectWithProximity
   * Constantly poll for objects that have left the ring.
   */
  scene.events.on("update", () => {
    proximity.x = objectWithProximity.x;
    proximity.y = objectWithProximity.y;
    groupToDetect
      .getChildren()
      .forEach((child: Phaser.Physics.Arcade.Sprite) =>
        checkProximityLeave(proximity, child)
      );
  });
}
