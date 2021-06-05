import { CreateGoal, CreateRandom, CreateWait } from "./lib";
import { LevelBlockType } from "../../components/systems/LevelBuilder";

export default [
  // {
  //   levelBlocks: [
  //     ...CreateRandom({
  //       type: [LevelBlockType.rival],
  //       numberOfSpawns: 30,
  //       durationBetweenSpawns: 1000,
  //       averageVelocity: 150,
  //     }),
  //   ],
  // },
  // {
  //   levelBlocks: [CreateWait(3000)],
  // },
  {
    levelBlocks: [CreateGoal()],
  },
];
