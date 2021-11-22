import Phaser from "phaser";

export default class GameStartLoadScene extends Phaser.Scene {
  constructor() {
    super("preloadStart");
  }
  //================================Preload
  preload() {
    this.preloadAudio();
    this.preloadImage();
    //load audio
    this.preloadSprite();
    //game Over
    let style = { font: "30px Arial", fill: "#000" };
    let textLoading = this.add.text(320, 300, `Loading...0%}`, style);
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0x00000, //black
      },
      lineStyle: {
        color: 0x00000,
        width: 10,
      },
    });

    /*Loader Events */
    this.load.on("progress", (percent: number) => {
      textLoading.setText(`Loading...${Math.floor(percent * 100)}%`);
      loadingBar.clear();

      loadingBar.strokeRect(
        175,
        this.game.renderer.height / 2 - 25,
        this.game.renderer.width / 2 + 50,
        100,
      );
      loadingBar.fillRect(
        200,
        this.game.renderer.height / 2,
        (this.game.renderer.width * percent) / 2,
        50,
      );
    });
    this.load.on("complete", () => {
      loadingBar.destroy();
      textLoading.destroy();
    });
  }
  preloadImage() {
    this.load.image("player_start", "assets/player/Player_1.png");
    this.load.image("ground", "assets/start/ground.png");
    this.load.image("btnStart", "assets/start/PlayButton.png");
  }
  preloadSprite() {}
  preloadAudio() {
    this.load.audio(
      "music",
      "assets/music/238069__shuinvy__childhoodmusicboxhalf.mp3",
    );
  }
  //=========================create
  create() {
    this.scene.start("start");
  }
}
