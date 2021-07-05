import { CreateGoal, CreateRandom, CreateWait } from "./lib";
import { LevelBlockType } from "../../components/systems/LevelBuilder";

export default [
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 10,
        durationBetweenSpawns: 6000,
        averageVelocity: 150,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 60,
        durationBetweenSpawns: 700,
        averageVelocity: 200,
      }),
    ],
  },
  {
    async: true,
    levelBlocks: [
      ...CreateRandom({
        type: LevelBlockType.antibody,
        numberOfSpawns: 10,
        durationBetweenSpawns: 6000,
        averageVelocity: 150,
      }),
    ],
  },
  {
    levelBlocks: [
      ...CreateRandom({
        type: [LevelBlockType.rival],
        numberOfSpawns: 70,
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
