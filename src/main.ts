import { Game } from "phaser";
import ScenesStart from "./scenes/ScenesStart";
import ScenesPlay from "./scenes/ScenesPlay";
import PreloadPlay from "./scenes/PreloadPlay";
import PreloadStart from "./scenes/PreloadStart";

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
  scene: [PreloadStart, ScenesStart, PreloadPlay, ScenesPlay],
};

export default config;

const game = new Game(config);
