import { Game } from "phaser";

import GameStartScene from "./scenes/GameStart/GameStartScene";
import GameStartLoadScene from "./scenes/GameStart/GameStartLoadScene";

import GamePlayScene from "./scenes/GamePlay/GamePlayScene";
import GamePlayLoadScene from "./scenes/GamePlay/GamePlayLoadScene";

let config = {
  type: Phaser.AUTO,
  parent: "canvas",
  width: 800,
  height: 400,
  backgroundColor: "#fff",

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
    fps: {
      target: 30,
      forceSetTimeOut: true,
    },
  },
  scene: [GameStartLoadScene, GameStartScene, GamePlayLoadScene, GamePlayScene],
};

export default config;

const game = new Game(config);
