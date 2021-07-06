import { LevelScoreData } from "./../components/systems/LevelScore";

/**
 * A series of functions meant to persist state between reloads
 * Meant for level progress/high scores
 * Can be substituted for cloud storage solution
 */

const SAVE_STATE_LOCAL_STORAGE_NAME = "game-save-state";

export type GameSaveState = Record<number, LevelScoreData>;

function createLocalData() {
  localStorage.setItem(SAVE_STATE_LOCAL_STORAGE_NAME, "{}");
}

export function getHighScore(levelId: number): LevelScoreData | undefined {
  const localData = JSON.parse(
    localStorage.getItem(SAVE_STATE_LOCAL_STORAGE_NAME)
  );

  if (localData?.[levelId]) {
    return localData[levelId];
  }

  return undefined;
}

/** Save the high score to local data */
export function setHighScore(
  levelId: number,
  levelScore: LevelScoreData
): void {
  const localData = JSON.parse(
    localStorage.getItem(SAVE_STATE_LOCAL_STORAGE_NAME) ?? "{}"
  );
  localData[levelId] = levelScore;

  localStorage.setItem(
    SAVE_STATE_LOCAL_STORAGE_NAME,
    JSON.stringify(localData)
  );
}
