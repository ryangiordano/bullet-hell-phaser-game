import { Item, Items } from "../data/Items";
import { LevelData } from "../data/levels/LevelRepository";
import { calculateLevelCompletePercentage } from "../components/systems/LevelScore";

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
  private rivalsMissed = 0;
  private unlockedLevelIds: number[] = [1, 2, 1, 2, 1];
  constructor() {}
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
  setRivalsMissed(value: number) {
    this.set<number>("rivalsMissed", value);
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
  getRivalsMissed() {
    return this.rivalsMissed;
  }

  set<T>(property: string, value: T) {
    this[property] = value;
    this.emitter.emit("update-state", {
      heroHealth: this.getHeroHealth(),
      currentCombo: this.getCurrentCombo(),
      totalDamageTaken: this.getTotalDamageTaken(),
      maxCombo: this.getMaxCombo(),
      rivalsMissed: this.getRivalsMissed(),
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
    this.rivalsMissed = 0;
  }

  getUnlockedLevels() {
    return this.unlockedLevelIds;
  }
  addUnlockedLevel(id: number) {
    this.unlockedLevelIds.push(id);
  }

  saveLevelScoreData({
    levelId,
    maxCombo,
    enemiesMissed,
    damageTaken,
    totalEnemies,
  }: {
    levelId: number;
    maxCombo: number;
    enemiesMissed: number;
    damageTaken: number;
    totalEnemies: number;
  }) {
    console.log(levelId, maxCombo, enemiesMissed, damageTaken);
    console.log(
      calculateLevelCompletePercentage({
        enemiesMissed,
        maxCombo,
        totalEnemies,
        damageTaken,
      })
    );
  }
}
