// Library functions for determining the score of a level

export type LevelScoreData = {
  enemiesDefeated: number;
  maxCombo: number;
  damageTaken: number;
  aggregateScore: number;
};

export enum MedalType {
  bronze = 0,
  silver = 1,
  gold = 2,
  platinum = 3,
}

function calculateEnemiesDefeatedScore(
  enemiesDefeated: number,
  totalEnemies: number
) {
  return Math.max(
    Math.min(Math.ceil((enemiesDefeated / totalEnemies) * 100), 100),
    0
  );
}

/** Return a percentage value based on
 */
function calculateMaxComboScore(combo: number, totalEnemies: number) {
  return Math.min(
    Math.ceil(((combo + totalEnemies / 3) / totalEnemies) * 100),
    100
  );
}

function calculateDamageTakenScore(damageTaken) {
  return (
    {
      [0]: 100,
      [1]: 90,
      [2]: 80,
      [3]: 70,
    }[damageTaken] ?? 0
  );
}

function getAggregateScoreData(
  maxComboPercentage: number,
  damageTakenPercentage: number,
  enemiesDefeatedPercentage: number
) {
  return Math.ceil(
    (maxComboPercentage + damageTakenPercentage + enemiesDefeatedPercentage) / 3
  );
}

/** Return the MedalType associated with argument score */
export function getMedalFromScore(percentage: number): MedalType {
  if (percentage >= 100) {
    return MedalType.platinum;
  }
  if (percentage >= 90) {
    return MedalType.gold;
  }
  if (percentage >= 80) {
    return MedalType.silver;
  }
  if (percentage >= 70) {
    return MedalType.bronze;
  }
  return null;
}

export function calculateLevelCompletePercentage({
  enemiesDefeated,
  maxCombo,
  totalEnemies,
  damageTaken,
}: {
  enemiesDefeated: number;
  maxCombo: number;
  totalEnemies: number;
  damageTaken: number;
}): LevelScoreData {
  enemiesDefeated = calculateEnemiesDefeatedScore(
    enemiesDefeated,
    totalEnemies
  );
  const comboScore = calculateMaxComboScore(maxCombo, totalEnemies);
  damageTaken = calculateDamageTakenScore(damageTaken);
  const aggregateScore = getAggregateScoreData(
    comboScore,
    enemiesDefeated,
    damageTaken
  );

  return {
    enemiesDefeated,
    maxCombo: comboScore,
    damageTaken,
    aggregateScore,
  };
}
