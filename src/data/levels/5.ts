import { CreateGoal, CreateRandom, CreateWait } from "./lib";
import { LevelBlockType } from "../../components/systems/LevelBuilder";

export default [
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 20,
        durationBetweenSpawns: 6000,
        averageVelocity: 200,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 70,
        durationBetweenSpawns: 1000,
        averageVelocity: 300,
      }),
    ],
  },
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 20,
        durationBetweenSpawns: 6000,
        averageVelocity: 200,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 140,
        durationBetweenSpawns: 700,
        averageVelocity: 250,
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
