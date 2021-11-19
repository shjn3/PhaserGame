import { Game } from "phaser";
import ScenesStart from "./scenes/ScenesStart";
import ScenesPlay from "./scenes/ScenesPlay";
import PreloadPlay from "./scenes/PreloadPlay";

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
  },
  scene: [ScenesStart, PreloadPlay, ScenesPlay],
};

export default config;

const game = new Game(config);
