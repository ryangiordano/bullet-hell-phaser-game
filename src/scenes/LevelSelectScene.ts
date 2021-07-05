import LevelCard from "../components/hud/LevelCard";
import LevelEgg from "../components/level-select/LevelEgg";
import Planet from "../components/map-objects/background/planet";
import Star from "../components/map-objects/background/Star";
import Hero from "../components/map-objects/hero/Hero";
import { getLevelDataById } from "../data/levels/LevelRepository";
import State from "../game-state/State";
import { withProximity } from "../lib/Proximity";
import { setWorldBounds } from "../lib/shared";
import { styles } from "../lib/styles";
import { getRandomBetween, getRandomInt } from "../lib/utility";

/** Position level eggs should appear on the main map */
const eggNodes = [
  {
    x: 200,
    y: 250,
  },
  {
    x: 800,
    y: 100,
  },
  {
    x: 400,
    y: 500,
  },
  {
    x: 600,
    y: 330,
  },
  {
    x: 700,
    y: 700,
  },
];

const orbits = [100, 200, 300, 400, 500];

export class LevelSelectScene extends Phaser.Scene {
  private hero: Hero;
  private boundaryCollide: Phaser.GameObjects.Group;

  private levelEggs: Phaser.GameObjects.Group;
  constructor() {
    super({ key: "LevelSelectScene" });
  }
  preload() {}

  async init(data) {
    this.setStarfield();
    this.cameras.main.setBackgroundColor(styles.colors.black.hex);
  }

  create() {
    const c = new LevelCard(this, 50, this.game.canvas.height - 250);
    c.setAlpha(0);
    this.events.on("update", () => {});
    const state = State.getInstance();
    this.levelEggs = new Phaser.GameObjects.Group(this);

    orbits.forEach((o) => {
      const a = new Phaser.GameObjects.Arc(
        this,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        o,
        0,
        360,
        false
      );
      a.setFillStyle(styles.colors.dark.hex, 0.1);
      this.add.existing(a);
    });

    new Planet(this, this.game.canvas.width / 2, this.game.canvas.height / 2);

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
        c.showCard(levelEgg.getLevelData());
      },
      onLeave: (_, levelEgg: LevelEgg) => {
        levelEgg.hideLevelData();
        c.hideCard();
      },
      size: 1,
    });
  }

  private setStarfield() {
    for (let i = 0; i < 100; i++) {
      const y = getRandomBetween(0, this.game.canvas.height);
      const x = getRandomBetween(0, this.game.canvas.width);
      const s = new Star(this, x, y);
      s.setAlpha(getRandomBetween(0, 0.5));
      this.add.existing(s);
    }
  }

  private setHeroLevelCollisions() {
    this.physics.add.collider(
      this.levelEggs,
      this.hero,
      async (egg: LevelEgg, hero: Hero) => {
        egg.jiggle();
        hero.knockBack(150);
        if (hero.charging) {
          const { id } = egg.getLevelData();
          this.startLevel(id);
        }
      }
    );
  }

  private startLevel(levelId: number) {
    this.scene.stop();

    this.scene.start("LevelScene", {
      levelId,
    });
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
