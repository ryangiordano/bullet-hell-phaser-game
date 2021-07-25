import { calculateLevelCompletePercentage } from "../components/systems/LevelScore";
import {
  getHighScore,
  getLevelData,
  setHighScore,
  setLevelUnlocked,
} from "./SaveState";

export type CurrentState = {
  heroHealth: number;
  currentCombo: number;
};

export default class State {
  public emitter = new Phaser.Events.EventEmitter();
  private static instance: State;
  private heroHealth = 3;
  private currentCombo = 0;
  private levelComplete = false;
  private totalDamageTaken = 0;
  private maxCombo = 0;
  private enemiesDefeated = 0;
  private unlockedLevelIds: Set<number> = new Set([1]);
  constructor() {
    this.updateUnlockedLevels();
  }
  static getInstance() {
    if (!State.instance) {
      State.instance = new State();
    }
    return this.instance;
  }

  incrementHealth() {
    this.set("heroHealth", Math.min(this.heroHealth + 1, 3));
  }

  decrementHealth() {
    this.set("heroHealth", Math.max(this.heroHealth - 1, 0));

    if (this.heroHealth === 0) {
      return this.emitter.emit("game-over");
    }
  }

  incrementCombo() {
    this.set("currentCombo", this.currentCombo + 1);
    this.set("maxCombo", Math.max(this.getMaxCombo(), this.getCurrentCombo()));
  }

  setCombo(value) {
    this.set("currentCombo", value);
  }

  setLevelComplete(value: boolean) {
    this.set<boolean>("levelComplete", value);
  }

  setMaxCombo(value: number) {
    this.set<number>("maxCombo", value);
  }
  setEnemiesDefeated(value: number) {
    this.set<number>("enemiesDefeated", value);
  }
  setTotalDamageTaken(value: number) {
    this.set<number>("totalDamageTaken", value);
  }

  getHeroHealth() {
    return this.heroHealth;
  }
  getCurrentCombo() {
    return this.currentCombo;
  }
  getLevelComplete() {
    return this.levelComplete;
  }
  getTotalDamageTaken() {
    return this.totalDamageTaken;
  }
  getMaxCombo() {
    return this.maxCombo;
  }
  getEnemiesDefeated() {
    return this.enemiesDefeated;
  }

  set<T>(property: string, value: T) {
    this[property] = value;
    this.emitter.emit("update-state", {
      heroHealth: this.getHeroHealth(),
      currentCombo: this.getCurrentCombo(),
      totalDamageTaken: this.getTotalDamageTaken(),
      maxCombo: this.getMaxCombo(),
      enemiesDefeated: this.getEnemiesDefeated(),
      levelComplete: this.getLevelComplete(),
    });
  }

  resetGame() {
    this.emitter = new Phaser.Events.EventEmitter();
    this.heroHealth = 3;
    this.currentCombo = 0;
    this.levelComplete = false;
    this.totalDamageTaken = 0;
    this.maxCombo = 0;
    this.enemiesDefeated = 0;
  }

  getUnlockedLevels() {
    return this.unlockedLevelIds;
  }

  saveLevelScoreData({
    levelId,
    maxCombo,
    enemiesDefeated,
    damageTaken,
    totalEnemies,
  }: {
    levelId: number;
    maxCombo: number;
    enemiesDefeated: number;
    damageTaken: number;
    totalEnemies: number;
  }) {
    const levelScoreData = calculateLevelCompletePercentage({
      enemiesDefeated,
      maxCombo,
      totalEnemies,
      damageTaken,
    });
    const previousHigh = getHighScore(levelId)?.aggregateScore;

    if (!previousHigh || levelScoreData.aggregateScore > previousHigh) {
      setHighScore(levelId, levelScoreData);
    }
  }

  getSavedUnlockedLevels() {
    const levelDataObj = getLevelData();
    const levelData = Object.keys(levelDataObj).map((k) => levelDataObj[k]);
    const unlockedLevelIds = (levelData || [])
      .filter((ld) => ld.unlocked)
      .map((ld) => ld.levelId);
    return unlockedLevelIds;
  }

  updateUnlockedLevels() {
    const unlockedLevelIds = this.getSavedUnlockedLevels();
    this.unlockedLevelIds = new Set([
      ...this.unlockedLevelIds,
      ...unlockedLevelIds,
    ]);
  }

  setLevelUnlocked(levelId: number) {
    setLevelUnlocked(levelId);
    this.updateUnlockedLevels();
  }
}
