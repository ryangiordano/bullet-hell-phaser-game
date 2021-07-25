import {
  LevelBlockType,
  LevelSegment,
} from "../../components/systems/LevelBuilder";
import { LevelScoreData } from "../../components/systems/LevelScore";
import levelOne from "./1";
import levelTwo from "./2";
import levelThree from "./3";
import levelFour from "./4";
import levelFive from "./5";

export type LevelData = {
  id: number;
  level: LevelSegment[];
  name: string;
  description: string;
  unlocks?: number;
  unlocked?: boolean;
  levelScoreData?: LevelScoreData;
};

export const levelData = {
  1: {
    id: 1,
    level: levelOne,
    name: "Level One",
    description: "To the egg!",
    unlocks: 2,
  },
  2: {
    id: 2,
    level: levelTwo,
    name: "Level Two",
    description: "The load runner.",
    unlocks: 3,
  },
  3: {
    id: 3,
    level: levelThree,
    name: "Level Three",
    description: "Watch out for big boys!",
    unlocks: 4,
  },
  4: {
    id: 4,
    level: levelFour,
    name: "Level Four",
    description: "Keep on rollin'.",
    unlocks: 5,
  },
  5: {
    id: 5,
    level: levelFive,
    name: "Level Five",
    description: "COVID in the house!",
  },
};

export function getLevelDataById(id: number): LevelData {
  if (!levelData[id]) {
    throw new Error(`Level data at ${id} does not exist`);
  }
  return levelData[id];
}

export function calculateNumberOfEnemies(levelData: LevelData) {
  return levelData.level.reduce<number>((acc, levelSegment) => {
    acc += levelSegment.levelBlocks.reduce<number>((a, levelBlock) => {
      if (levelBlock.type === LevelBlockType.rival) {
        a++;
      }
      return a;
    }, 0);
    return acc;
  }, 0);
}
