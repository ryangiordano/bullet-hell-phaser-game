// Library functions for determining the score of a level

export type LevelScoreData = {
  enemiesDefeated: number;
  maxCombo: number;
  damageTaken: number;
  aggregateScore: number;
};

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

//10, 10, 10/3, 13/10

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
  console.log(
    maxComboPercentage,
    damageTakenPercentage,
    enemiesDefeatedPercentage
  );
  return Math.ceil(
    (maxComboPercentage + damageTakenPercentage + enemiesDefeatedPercentage) / 3
  );
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
