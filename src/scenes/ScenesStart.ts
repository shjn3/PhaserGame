import Phaser from "phaser";

export default class ScenesStart extends Phaser.Scene {
  menuSound?: Phaser.Sound.BaseSound;
  constructor() {
    super("start");
  }
  preload() {}
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
    this.menuSound = this.sound.add("music", {
      loop: true,
    });
    this.menuSound.play();
  }
  update(time: number, delta: number): void {}
  onChangeScenes() {
    this.menuSound?.destroy();
    this.scene.start("preloadPlay");
  }
}
