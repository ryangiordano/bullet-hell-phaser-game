import {
  CreateGoal,
  CreateLine,
  CreateRandom,
  CreateWait,
  CreateWave,
} from "./lib";
import { LevelBlockType } from "../../components/systems/LevelBuilder";

export default [
  {
    levelBlocks: [
      ...CreateWave(
        [null, null, { dur: 0, vel: 150, async: true }, null, null, null],
        LevelBlockType.covid
      ),
    ],
  },
  {
    levelBlocks: [CreateWait(7000)],
  },
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 5,
        durationBetweenSpawns: 6000,
        averageVelocity: 100,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 20,
        durationBetweenSpawns: 1000,
        averageVelocity: 200,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateWave(
        [
          { dur: 0, vel: 100, async: true },
          null,
          { dur: 0, vel: 150, async: true },
          null,
          { dur: 0, vel: 100, async: true },
          null,
        ],
        LevelBlockType.covid
      ),
    ],
  },
  {
    levelBlocks: [CreateWait(7000)],
  },
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 5,
        durationBetweenSpawns: 6000,
        averageVelocity: 150,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 30,
        durationBetweenSpawns: 700,
        averageVelocity: 200,
      }),
    ],
  },
  {
    levelBlocks: [CreateWait(3000)],
  },
  {
    levelBlocks: [CreateGoal()],
  },
];
