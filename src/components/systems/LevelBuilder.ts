import Enemy from "../map-objects/enemies/Enemy";
import Antibody from "../map-objects/enemies/Antibody";
import { asyncForEach } from "../../lib/utility";
import Egg from "../map-objects/Egg";

export enum LevelBlockType {
  rival,
  antibody,
  goal,
  wait,
}

export enum LevelPositions {
  gameBottom,
  gameTop,
  gameLeft,
  gameRight,
  gameCenterX,
  gameCenterY,
  gameXQuintant0,
  gameXQuintant1,
  gameXQuintant2,
  gameXQuintant3,
  gameXQuintant4,
  gameXQuintant5,
  gameYQuintant0,
  gameYQuintant1,
  gameYQuintant2,
  gameYQuintant3,
  gameYQuintant4,
  gameYQuintant5,
}

export type LevelSegment = {
  async?: boolean;
  levelBlocks: LevelBlock[];
};

export type LevelBlock = {
  type: LevelBlockType;
  spawnX?: number;
  spawnY?: number;
  posX?: LevelPositions;
  posY?: LevelPositions;
  velocity?: number;
  duration?: number;
  async?: boolean;
};

export type ExecutableLevelSegment = {
  async?: boolean;
  levelBlocks: (() => Promise<void>)[];
};

export default class LevelBuilder {
  constructor(private scene) {}

  /** For standardized positioning of enemies */
  private getLevelPosition(position: LevelPositions): number {
    const canvas = this.scene.game.canvas;
    return {
      [LevelPositions.gameBottom]: canvas.height + 200,
      [LevelPositions.gameTop]: -200,
      [LevelPositions.gameLeft]: 0,
      [LevelPositions.gameRight]: canvas.width,
      [LevelPositions.gameCenterX]: canvas.width / 2,
      [LevelPositions.gameCenterY]: canvas.height / 2,
      [LevelPositions.gameXQuintant0]: 40,
      [LevelPositions.gameXQuintant1]: canvas.width / 5,
      [LevelPositions.gameXQuintant2]: (canvas.width / 5) * 2,
      [LevelPositions.gameXQuintant3]: (canvas.width / 5) * 3,
      [LevelPositions.gameXQuintant4]: (canvas.width / 5) * 4,
      [LevelPositions.gameXQuintant5]: canvas.width - 40,
      [LevelPositions.gameYQuintant0]: 40,
      [LevelPositions.gameYQuintant1]: canvas.height / 5,
      [LevelPositions.gameYQuintant2]: (canvas.height / 5) * 2,
      [LevelPositions.gameYQuintant3]: (canvas.height / 5) * 3,
      [LevelPositions.gameYQuintant4]: (canvas.height / 5) * 4,
      [LevelPositions.gameYQuintant5]: canvas.height - 40,
    }[position];
  }

  /** Build an array of ExecutableLevelSegments */
  public build(
    data: LevelSegment[],
    groupMap: Record<
      Exclude<LevelBlockType, LevelBlockType.wait>,
      (e: Phaser.Physics.Arcade.Sprite) => void
    >
  ): ExecutableLevelSegment[] {
    return data.map((segment) => {
      return {
        async: segment.async,
        levelBlocks: segment.levelBlocks.map((levelBlock) => {
          switch (levelBlock.type) {
            case LevelBlockType.wait:
              return () => this.executeWaitLevelBlock(levelBlock);
            case LevelBlockType.antibody:
              return () =>
                this.executeAntibodyLevelBlock(
                  levelBlock,
                  groupMap[levelBlock.type]
                );

            case LevelBlockType.rival:
              return () =>
                this.executeRivalLevelBlock(
                  levelBlock,
                  groupMap[levelBlock.type]
                );
            case LevelBlockType.goal:
              return () =>
                this.executeGoalLevelBlock(
                  levelBlock,
                  groupMap[levelBlock.type]
                );
          }
        }),
      };
    });
  }

  public async play(level: ExecutableLevelSegment[]) {
    const l = level.map((segment) => {
      return () =>
        new Promise<void>(async (resolve) => {
          if (segment.async) {
            resolve();
          }
          await asyncForEach(segment.levelBlocks, async (promise) => {
            await promise();
          });
          if (!segment.async) {
            resolve();
          }
        });
    });
    return asyncForEach(l, async (p) => {
      await p();
    });
  }

  executeRivalLevelBlock(
    { spawnX, spawnY, duration, velocity, posX, posY, async }: LevelBlock,
    addToGroup: (e: Phaser.Physics.Arcade.Sprite) => void
  ) {
    return new Promise<void>((resolve) => {
      if (async) {
        resolve();
      }
      setTimeout(() => {
        const d = this.scene.add.existing(
          new Enemy(
            this.scene,
            this.getLevelPosition(posX) ?? spawnX,
            this.getLevelPosition(posY) ?? spawnY,
            velocity
          )
        );
        addToGroup(d);
        resolve();
      }, duration ?? 0);
    });
  }

  executeAntibodyLevelBlock(
    { spawnX, spawnY, duration, velocity, posX, posY }: LevelBlock,
    addToGroup: (e: Phaser.Physics.Arcade.Sprite) => void
  ) {
    return new Promise<void>((resolve) => {
      const d = this.scene.add.existing(
        new Antibody(
          this.scene,
          this.getLevelPosition(posX) ?? spawnX,
          this.getLevelPosition(posY) ?? spawnY,
          velocity
        )
      );
      addToGroup(d);
      setTimeout(() => resolve(), duration ?? 0);
    });
  }

  executeGoalLevelBlock(
    { spawnX, spawnY, duration, posX, posY }: LevelBlock,
    addToGroup: (e: Phaser.Physics.Arcade.Sprite) => void
  ) {
    return new Promise<void>((resolve) => {
      const egg = new Egg(
        this.scene,
        this.getLevelPosition(posX) ?? spawnX,
        this.getLevelPosition(posY) ?? spawnY
      );
      const d = this.scene.add.existing(egg);
      egg.setVelocity(0, 100);
      setTimeout(() => {
        egg.setVelocity(0, 0);

        addToGroup(d);
      }, 7000);
      setTimeout(() => resolve(), duration ?? 0);
    });
  }
  executeWaitLevelBlock({ duration }: LevelBlock) {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), duration ?? 0);
    });
  }
}
