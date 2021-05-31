import {
  LevelBlockType,
  LevelPositions,
} from "../../components/systems/LevelBuilder";
import { getRandomInt } from "../../lib/utility";
import { LevelBlock } from "../../components/systems/LevelBuilder";

export const ArrowFormation = (wait: number) => {};

/** In a wave, the LevelPosition that corresponds with the index of the item in the array argument */
const indexPos = {
  0: LevelPositions.gameXQuintant0,
  1: LevelPositions.gameXQuintant1,
  2: LevelPositions.gameXQuintant2,
  3: LevelPositions.gameXQuintant3,
  4: LevelPositions.gameXQuintant4,
  5: LevelPositions.gameXQuintant5,
};

const getObstacleStartPoint = (type: LevelBlockType) => {
  const map = {
    [LevelBlockType.antibody]: LevelPositions.gameTop,
    [LevelBlockType.rival]: LevelPositions.gameBottom,
    [LevelBlockType.goal]: LevelPositions.gameTop,
  };
  return map[type];
};

export const CreateWave = (
  formation: ({ dur: number; vel: number; async?: boolean } | null)[],
  type: LevelBlockType
) => {
  return formation
    .map((options, index) => {
      if (options === null) {
        return null;
      }
      return {
        type,
        posX: indexPos[index],
        posY: getObstacleStartPoint(type) ?? 0,
        duration: options.dur,
        velocity: options.vel,
        async: options?.async,
      };
    })
    .filter((obj) => obj)
    .sort((a, b) => a.duration - b.duration);
};

export const CreateInvertedArrow = (vel: number) => {
  return CreateWave(
    [
      { dur: 0, vel, async: true },
      { dur: 1000, vel, async: true },
      { dur: 2000, vel, async: true },
      { dur: 2000, vel, async: true },
      { dur: 1000, vel, async: true },
      { dur: 0, vel, async: true },
    ],
    LevelBlockType.rival
  );
};

export const CreateArrow = (vel: number) => {
  return CreateWave(
    [
      { dur: 2000, vel, async: true },
      { dur: 1000, vel, async: true },
      { dur: 0, vel, async: true },
      { dur: 0, vel, async: true },
      { dur: 1000, vel, async: true },
      { dur: 2000, vel, async: true },
    ],
    LevelBlockType.rival
  );
};

export const CreateWait = (wait: number) => ({
  type: LevelBlockType.wait,
  duration: wait,
});

export const CreateRandom = ({
  type,
  numberOfSpawns,
  durationBetweenSpawns,
  averageVelocity,
}: {
  type: LevelBlockType | LevelBlockType[];
  numberOfSpawns: number;
  durationBetweenSpawns: number;
  averageVelocity: number;
}): LevelBlock[] => {
  return new Array(Math.floor(numberOfSpawns)).fill(null).map((f) => {
    const t = Array.isArray(type)
      ? type[Math.floor(Math.random() * type.length)]
      : type;
    return {
      type: t,
      posX: indexPos[Math.floor(Math.random() * 6)],
      posY: getObstacleStartPoint(t) ?? 0,
      duration: durationBetweenSpawns,
      velocity:
        averageVelocity +
        getRandomInt(-averageVelocity * 0.5, averageVelocity * 0.5),
      async: false,
    };
  });
};

export const CreateGoal = () => {
  return {
    type: LevelBlockType.goal,
    posX: LevelPositions.gameCenterX,
    spawnY: -250,
  };
};

export const ExplodeEverything = () => {
  //TODO
};

export const InterruptCurrent = () => {
  //TODO
};
