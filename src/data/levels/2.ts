import { CreateGoal, CreateRandom, CreateWait } from "./lib";
import { LevelBlockType } from "../../components/systems/LevelBuilder";

export default [
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
        numberOfSpawns: 30,
        durationBetweenSpawns: 1000,
        averageVelocity: 150,
      }),
    ],
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
        numberOfSpawns: 40,
        durationBetweenSpawns: 700,
        averageVelocity: 150,
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
