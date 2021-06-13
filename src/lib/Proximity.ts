/** GameObjects that have proximity need to implement HasProximity */
export interface HasProximity {
  proximity: Phaser.GameObjects.Sprite;
}

export function withProximity({
  scene,
  objectWithProximity,
  groupToDetect,
  onEnter,
  onLeave,
}: {
  scene: Phaser.Scene;
  objectWithProximity: Phaser.Physics.Arcade.Sprite & {
    proximity: Phaser.Physics.Arcade.Sprite;
  };
  groupToDetect: Phaser.GameObjects.Group;
  onEnter: (
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => void;
  onLeave: (
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) => void;
}) {
  scene.physics.add.overlap(
    objectWithProximity.proximity,
    groupToDetect,
    (_, objectDetected) => checkProximityEnter(objectDetected)
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

  scene.events.on("update", () =>
    groupToDetect
      .getChildren()
      .forEach((child: Phaser.Physics.Arcade.Sprite) =>
        checkProximityLeave(objectWithProximity.proximity, child)
      )
  );
}

export function distanceProximity({
  scene,
  objectWithProximity,
  groupToDetect,
  callback,
}: {
  scene: Phaser.Scene;
  objectWithProximity: { proximity: Phaser.Physics.Arcade.Sprite };
  groupToDetect: Phaser.GameObjects.Group;
  callback: (
    proximity: Phaser.Physics.Arcade.Sprite,
    objectDetected: Phaser.Physics.Arcade.Sprite
  ) => void;
}) {
  groupToDetect.getChildren().forEach((c: Phaser.GameObjects.Sprite) => {
    console.log(c.x, c.y);
  });
}
