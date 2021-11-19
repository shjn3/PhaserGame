import Phaser from "phaser";

export default class ScenesStart extends Phaser.Scene {
  constructor() {
    super("start");
  }
  preload() {
    this.load.image("player_start", "assets/player/Player_1.png");
    this.load.image("ground", "assets/start/ground.png");
    this.load.image("btnStart", "assets/start/PlayButton.png");
  }
  create() {
    this.add.image(50, 310, "player_start").setScale(0.35);
    this.add.image(0, 330, "ground");
    this.add.sprite(400, 200, "btnStart").setScale(0.5);
    let style = { font: "30px Arial", fill: "#000" };
    this.add.text(320, 260, "Click to start", style);
    this.input.on("pointerdown", (e: Phaser.Input.Pointer) => {
      if (e.downX > 300 && e.downX < 500 && e.downY > 150 && e.downY < 250) {
        this.onChangeScenes();
      }
    });
  }
  update(time: number, delta: number): void {}
  onChangeScenes() {
    this.scene.start("preloadPlay");
  }
}
