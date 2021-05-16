import State, { CurrentState } from "../../game-state/State";
import Heart from "./Heart";

export class HeadsUpDisplay extends Phaser.GameObjects.Container {
  private heroHealth: number;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const state = State.getInstance();

    state.emitter.on("update-state", ({ heroHealth }: CurrentState) => {
      this.setHeroHealth(heroHealth);
    });

    this.heroHealth = state.getHeroHealth();
    this.renderHearts();
  }

  renderHearts() {
    for (let i = 0; i < this.heroHealth; i++) {
      this.add(new Heart(this.scene, -i * 70, 0));
    }
  }

  setHeroHealth(value: number) {
    this.heroHealth = value;
    this.removeAll(true);
    this.renderHearts();
  }
}
