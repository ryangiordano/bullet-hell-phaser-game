import State from "../../game-state/State";
import { animateCombo, styles } from "../../lib/shared";
import { wait } from "../../lib/utility";
import Egg from "../map-objects/Egg";
import Antibody from "../map-objects/enemies/Antibody";
import Enemy from "../map-objects/enemies/Enemy";
import Hero, { HeroStates } from "../map-objects/hero/Hero";
import Health from "../map-objects/items/Health";
import Hit from "../map-objects/misc/Hit";
import ShockWave from "../map-objects/misc/ShockWave";

/** Class for handling all collisions  */
export class Collisions {
  constructor(private scene: Phaser.Scene) {}

  /** Enemies can hurt the hero, or get killed by him.
   * If the hero has a large enough combo, he can generate shockwaves
   */
  public setHeroEnemyCollisions(
    enemies: Phaser.GameObjects.Group,
    hero: Hero,
    enemyKillCallback: (enemy: Enemy, hero: Hero) => void
  ) {
    const state = State.getInstance();
    this.scene.physics.add.overlap(
      enemies,
      hero,
      async (enemy: Enemy, hero: Hero) => {
        /** Hero charges enemy */
        if (hero.charging && !enemy.dying) {
          enemyKillCallback(enemy, hero);
        } else if (!hero.invuln && !hero.charging) {
          this.scene.add.existing(new Hit(this.scene, enemy.x, enemy.y));
          hero.getHurt();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );
  }

  /** Enemies get killed by shockwaves, incrementing your combo */
  public setEnemyShockwaveCollisions(
    enemies: Phaser.GameObjects.Group,
    shockwaves: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.scene.physics.add.overlap(enemies, shockwaves, (enemy: Enemy) => {
      if (!enemy.dying) {
        enemy.kill();
        state.incrementCombo();
        animateCombo(enemy.x, enemy.y, state.getCurrentCombo(), this.scene);
      }
    });
  }

  /** Hero gets hurt by antibodies */
  public setHeroAntibodyCollisions(
    hero: Hero,
    antibodies: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.scene.physics.add.overlap(
      hero,
      antibodies,
      (hero: Hero, antibody: Antibody) => {
        if (!hero.invuln) {
          this.scene.add.existing(new Hit(this, hero.x, hero.y));
          hero.getHurt();
          antibody.jiggle();
          state.setCombo(0);
          state.decrementHealth();
        }
      }
    );
  }

  /** The enemies are killed by antibodies */
  public setEnemyAntibodyCollisions(
    enemies: Phaser.GameObjects.Group,
    antibodies: Phaser.GameObjects.Group
  ) {
    this.scene.physics.add.overlap(
      enemies,
      antibodies,
      (enemy: Enemy, antibody: Antibody) => {
        antibody.jiggle();

        if (!enemy.dying) {
          enemy.kill();
          this.scene.add.existing(new Hit(this, enemy.x, enemy.y));
        }
      }
    );
  }

  /** There hero collects items */
  public setHeroItemsCollisions(
    hero: Hero,
    itemsLayer: Phaser.GameObjects.Group
  ) {
    const state = State.getInstance();
    this.scene.physics.add.overlap(hero, itemsLayer, (_, item) => {
      item.destroy();
      state.incrementHealth();
    });
  }

  /** The goal can interact with the hero.
   * Upon being charged at, the game will transition to the win scene
   */
  public setHeroGoalCollisions(
    hero: Hero,
    goal: Phaser.GameObjects.Group,
    onDefeatCallback: (egg: Egg) => void
  ) {
    this.scene.physics.add.collider(
      goal,
      hero,
      async (egg: Egg, hero: Hero) => {
        const state = State.getInstance();
        egg.jiggle();

        if (hero.charging && !egg.invulnerable) {
          if (!state.getLevelComplete()) {
            egg.setVelocity(0, 0);
            await egg.takeDamage();
            if (egg.defeated) {
              onDefeatCallback(egg);
            }

            // this.scene.add.text(
            //   450,
            //   this.scene.game.canvas.height / 2,
            //   "GOAL",
            //   {
            //     fontFamily: "pixel",
            //     color: styles.colors.darkGreen.string,
            //     fontSize: "50px",
            //     fontStyle: "bold",
            //   }
            // );
            // this.scene.scene.pause();
            // this.scene.scene.stop("HUDScene");
            // await wait(2000);
            // this.scene.scene.stop();
            // this.scene.scene.start("VictoryScene");
          }
        }
      }
    );
  }
}
