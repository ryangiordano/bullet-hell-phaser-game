import LevelEgg from "../components/level-select/LevelEgg";
import Hero from "../components/map-objects/hero/Hero";
import { getLevelDataById } from "../data/levels/LevelRepository";
import State from "../game-state/State";
import { distanceProximity, withProximity } from "../lib/Proximity";
import { setWorldBounds, styles } from "../lib/shared";
import { wait } from "../lib/utility";

/** Position level eggs should appear on the main map */
const eggNodes = [
  {
    x: 200,
    y: 250,
  },
  {
    x: 700,
    y: 200,
  },
  {
    x: 400,
    y: 500,
  },
  {
    x: 250,
    y: 800,
  },
  {
    x: 700,
    y: 700,
  },
];

export class LevelSelectScene extends Phaser.Scene {
  private hero: Hero;
  private boundaryCollide: Phaser.GameObjects.Group;

  private levelEggs: Phaser.GameObjects.Group;
  constructor() {
    super({ key: "LevelSelectScene" });
  }
  preload() {}

  async init(data) {}

  create() {
    this.events.on("update", () => {});
    const state = State.getInstance();
    //create and add the level egg here

    this.levelEggs = new Phaser.GameObjects.Group(this);

    this.hero = this.physics.add.existing(
      new Hero(this, this.game.canvas.width / 2, this.game.canvas.height - 100)
    );

    state.getUnlockedLevels().forEach((levelId, index) => {
      const eggNode = eggNodes[index];
      const levelEgg = new LevelEgg(
        this,
        eggNode.x,
        eggNode.y,
        getLevelDataById(levelId)
      );
      this.levelEggs.add(levelEgg);
    });

    this.boundaryCollide = new Phaser.GameObjects.Group(this, [this.hero]);
    this.hero.init();
    this.setWorldBounds();

    this.setHeroLevelCollisions();

    withProximity({
      scene: this,
      objectWithProximity: this.hero,
      groupToDetect: this.levelEggs,
      onEnter: (_, levelEgg: LevelEgg) => {
        levelEgg.displayLevelData();
      },
      onLeave: (_, levelEgg: LevelEgg) => {
        levelEgg.hideLevelData();
      },
    });
  }

  private setHeroLevelCollisions() {
    this.physics.add.collider(
      this.levelEggs,
      this.hero,
      async (egg: LevelEgg, hero: Hero) => {
        egg.jiggle();
        if (hero.charging) {
        }
      }
    );
  }

  private startLevel() {
    this.scene.start("MainScene");
    this.scene.start("HUDScene");
  }

  /** Set the static boundaries that keep the hero and goal from
   * wandering outside them.
   */
  private setWorldBounds() {
    const boundaryStaticGroup = setWorldBounds(this);

    this.physics.add.collider(boundaryStaticGroup, this.boundaryCollide);
  }

  update() {
    this.hero.update();
  }
}
