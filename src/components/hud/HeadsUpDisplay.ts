import State, { CurrentState } from "../../game-state/State";

export class HeadsUpDisplay extends Phaser.GameObjects.Container {
  private lumberText: Phaser.GameObjects.Text;
  private goldText: Phaser.GameObjects.Text;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // this.goldText = new Phaser.GameObjects.Text(scene, 150, 0, "", {});
    // this.lumberText = new Phaser.GameObjects.Text(this.scene, 0, 0, "", {});
    // this.add([this.goldText, this.lumberText]);
    // this.setLumber(0);
    // this.setGold(0);
    const state = State.getInstance();

    state.emitter.on("update-state", ({ gold, lumber }: CurrentState) => {
      this.setLumber(lumber);
      this.setGold(gold);
      
    });
  }

  setLumber(value: string | number) {
    this.lumberText.setText(`Lumber: ${value}`);
  }

  setGold(value: string | number) {
    this.goldText.setText(`Gold: ${value}`);
  }
}
