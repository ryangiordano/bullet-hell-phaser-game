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
        numberOfSpawns: 300,
        durationBetweenSpawns: 1000,
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
