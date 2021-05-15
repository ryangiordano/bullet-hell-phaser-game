import { Item, Items } from "../data/Items";

export type CurrentState = {
  lumber: number;
  gold: number;
};

export default class State {
  private lumber: number = 0;
  private gold: number = 0;
  private items: Item[] = [];
  public emitter = new Phaser.Events.EventEmitter();
  private static instance: State;

  static getInstance() {
    if (!State.instance) {
      State.instance = new State();
    }
    return this.instance;
  }

  addLumber(amount) {
    this.set("lumber", this.lumber + Math.abs(amount));
  }

  removeLumber(amount) {
    this.set("lumber", Math.max(this.lumber - Math.abs(amount), 0));
  }

  addGold(amount) {
    this.set("gold", this.gold + Math.abs(amount));
  }
  removeGold(amount) {
    this.set("gold", Math.max(this.gold - Math.abs(amount), 0));
  }

  getItem(itemId) {
    const inInventory = this.items.find((item) => item.id === itemId);
    return inInventory;
  }

  addItem(itemId: number, number: number = 1) {
    const i = Items.get(itemId);
    if (!i) {
      throw new Error(`item at ${i} does not exist`);
    }
    const inInventory = this.getItem(itemId);
    if (inInventory) {
      return (inInventory.quantity += number);
    }

    this.items.push({ ...i, quantity: number });
  }

  removeItem(itemId: number, number: number = 1) {
    const i = Items.get(itemId);
    if (!i) {
      throw new Error(`item at ${i} does not exist`);
    }
    const inInventory = this.getItem(itemId);
    if (inInventory) {
      inInventory.quantity = Math.max(0, inInventory.quantity - number);
      if (inInventory.quantity === 0) {
        this.items.filter((i) => i.id === itemId);
      }
    }
  }

  getLumber() {
    return this.lumber;
  }
  getGold() {
    return this.gold;
  }

  set(property: string, value: number) {
    this[property] = value;
    this.emitter.emit("update-state", {
      gold: this.getGold(),
      lumber: this.getLumber(),
    });
  }
}
