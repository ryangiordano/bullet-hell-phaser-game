import State, { CurrentState } from "../../game-state/State";
import Heart from "./Heart";

export class HeadsUpDisplay extends Phaser.GameObjects.Container {
  private heroHealth: number;
  private currentCombo: number;
  private heartContainer: Phaser.GameObjects.Container;
  private comboContainer: Phaser.GameObjects.Container;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const state = State.getInstance();
    state.emitter.on(
      "update-state",
      ({ heroHealth, currentCombo }: CurrentState) => {
        this.setHeroHealth(heroHealth);
      }
    );

    this.heartContainer = this.scene.add.existing(
      new Phaser.GameObjects.Container(
        scene,
        this.scene.game.canvas.width - 50,
        50
      )
    );

    this.comboContainer = this.scene.add.existing(
      new Phaser.GameObjects.Container(scene, 50, 50)
    );

    this.heroHealth = state.getHeroHealth();
    this.renderHearts();
  }

  renderHearts() {
    for (let i = 0; i < this.heroHealth; i++) {
      this.heartContainer.add(new Heart(this.scene, -i * 70, 0));
    }
  }

  setHeroHealth(value: number) {
    this.heroHealth = value;
    this.heartContainer.removeAll(true);
    this.renderHearts();
  }
}
