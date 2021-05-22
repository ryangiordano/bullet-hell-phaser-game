import { Item, Items } from "../data/Items";

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
    if (true) {
      this.emitter.emit("combo-milestone");
    }
  }

  setCombo(value) {
    this.set("currentCombo", value);
  }

  setLevelComplete(value: boolean) {
    this.set<boolean>("levelComplete", value);
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

  set<T>(property: string, value: T) {
    this[property] = value;
    this.emitter.emit("update-state", {
      heroHealth: this.getHeroHealth(),
      currentCombo: this.getCurrentCombo(),
      levelComplete: this.getLevelComplete(),
    });
  }

  resetGame() {
    this.emitter = new Phaser.Events.EventEmitter();
    this.heroHealth = 3;
    this.currentCombo = 0;
    this.levelComplete = false;
  }
}
