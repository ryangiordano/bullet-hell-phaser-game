import { LevelSegment } from "../../components/systems/LevelBuilder";
import levelOne from "./1";
import levelTwo from "./2";

export type LevelData = {
  id: number;
  level: LevelSegment[];
  name: string;
};

export const levelData = {
  1: {
    id: 1,
    level: levelOne,
    name: "Level One",
  },
  2: {
    id: 2,
    level: levelTwo,
    name: "Level Two",
  },
};

export function getLevelDataById(id: number): LevelData {
  if (!levelData[id]) {
    throw new Error(`Level data at ${id} does not exist`);
  }
  return levelData[id];
}
