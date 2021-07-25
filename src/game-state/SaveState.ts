import { LevelScoreData } from "./../components/systems/LevelScore";

/**
 * A series of functions meant to persist state between reloads
 * Meant for level progress/high scores
 * Can be substituted for cloud storage solution
 */

const SAVE_STATE_LOCAL_STORAGE_NAME = "game-save-state";

export type GameSaveState = Record<
  number,
  { unlocked?: boolean; scoreData: LevelScoreData }
>;

export function getLevelData() {
  const localData = JSON.parse(
    localStorage.getItem(SAVE_STATE_LOCAL_STORAGE_NAME)
  );
  return localData || {};
}

export function getHighScore(levelId: number): LevelScoreData | undefined {
  const localData = getLevelData();
  if (localData?.[levelId]?.scoreData) {
    return localData[levelId].scoreData;
  }

  return undefined;
}

/** Save the high score to local data */
export function setHighScore(
  levelId: number,
  levelScore: LevelScoreData
): void {
  const localData = getLevelData();
  localData[levelId] = {
    levelId,
    unlocked: localData[levelId]?.unlocked,
    scoreData: levelScore,
  };

  localStorage.setItem(
    SAVE_STATE_LOCAL_STORAGE_NAME,
    JSON.stringify(localData)
  );
}

export function getLevelLockStatus(levelId: number) {
  return Boolean(getLevelData()?.[levelId]?.unlocked);
}

export function setLevelUnlocked(levelId: number): void {
  const localData = getLevelData();
  if (localData[levelId]) {
    localData[levelId].unlocked = true;
  } else {
    localData[levelId] = {
      levelId,
      unlocked: true,
    };
  }

  localStorage.setItem(
    SAVE_STATE_LOCAL_STORAGE_NAME,
    JSON.stringify(localData)
  );
}
