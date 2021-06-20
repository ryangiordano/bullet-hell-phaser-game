// Library functions for determining the score of a level

export type LevelScoreData = {
  enemiesMissed: number;
  maxCombo: number;
  damageTaken: number;
  aggregateScore: number;
};

function calculateEnemiesMissedScore(
  enemiesMissed: number,
  totalEnemies: number
) {
  return Math.max(
    Math.min(
      Math.ceil(((totalEnemies - enemiesMissed) / totalEnemies) * 100),
      100
    ),
    0
  );
}

/** Return a percentage value
 * Might need to consider not needing the player to 100% this one, since
 * obstacles can kill rivals too...
 */
function calculateHighComboScore(combo: number, totalEnemies: number) {
  return 100 - Math.ceil(((totalEnemies - combo) / totalEnemies) * 100);
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
  enemiesMissedPercentage: number
) {
  return Math.ceil(
    (maxComboPercentage + damageTakenPercentage + enemiesMissedPercentage) / 3
  );
}

export function calculateLevelCompletePercentage({
  enemiesMissed,
  maxCombo,
  totalEnemies,
  damageTaken,
}: {
  enemiesMissed: number;
  maxCombo: number;
  totalEnemies: number;
  damageTaken: number;
}): LevelScoreData {
  enemiesMissed = calculateEnemiesMissedScore(enemiesMissed, totalEnemies);
  const combo = calculateHighComboScore(maxCombo, totalEnemies);
  damageTaken = calculateDamageTakenScore(damageTaken);
  const aggregateScore = getAggregateScoreData(
    maxCombo,
    enemiesMissed,
    damageTaken
  );

  return {
    enemiesMissed,
    maxCombo: combo,
    damageTaken,
    aggregateScore,
  };
}
