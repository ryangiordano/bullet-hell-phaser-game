import { Item, Items } from "../data/Items";

export type CurrentState = {
  heroHealth: number;
};

export default class State {
  public emitter = new Phaser.Events.EventEmitter();
  private static instance: State;
  private heroHealth: 3;
  static getInstance() {
    if (!State.instance) {
      State.instance = new State();
    }
    return this.instance;
  }

  decrementHealth() {
    if (this.heroHealth - 1 === 0) {
      return this.emitter.emit("game-over");
    }
    this.set("heroHealth", (this.heroHealth -= 1));
  }

  getHeroHealth() {
    return this.heroHealth;
  }
  set(property: string, value: number) {
    this[property] = value;
    this.emitter.emit("update-state", {
      heroHealth: this.getHeroHealth(),
    });
  }
}
