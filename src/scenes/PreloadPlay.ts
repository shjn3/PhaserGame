import Phaser from "phaser";

export default class PreLoadPlay extends Phaser.Scene {
  constructor() {
    super("preloadPlay");
  }
  //================================Preload
  preload() {
    this.preloadAudio();
    this.preloadImage();
    //load audio
    this.preloadSprite();
    //game Over

    /*Loader Events */
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff, //white
      },
    });
    this.load.on("progress", (percent: number) => {
      loadingBar.fillRect(
        this.game.renderer.width / 2,
        0,
        50,
        this.game.renderer.height * percent
      );
      console.log(percent);
    });
  }
  preloadImage() {
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("ground", "assets/start/ground.png");
    this.load.image("cactuses0", "assets/obstacles/cactuses_big_1.png");
    this.load.image("cactuses1", "assets/obstacles/cactuses_big_2.png");
    this.load.image("cactuses2", "assets/obstacles/cactuses_big_3.png");
    this.load.image("cactuses3", "assets/obstacles/cactuses_small_1.png");
    this.load.image("cactuses4", "assets/obstacles/cactuses_small_2.png");
    this.load.image("cactuses5", "assets/obstacles/cactuses_small_3.png");
    this.load.image("textGameOver", "assets/gameOver/game-over.png");
    this.load.image("btnRestart", "assets/gameOver/restart.png");
  }
  preloadSprite() {
    this.load.spritesheet("playerRun", "assets/player/dino-run.png", {
      frameWidth: 88,
      frameHeight: 90,
    });
    this.load.spritesheet("playerDuck", "assets/player/dino-down.png", {
      frameWidth: 118,
      frameHeight: 90,
    });
    this.load.spritesheet("bird", "assets/obstacles/enemy-bird.png", {
      frameWidth: 92,
      frameHeight: 70,
    });
  }
  preloadAudio() {
    this.load.audio(
      "hehe",
      "assets/music/238069__shuinvy__childhoodmusicboxhalf.mp3"
    );
    this.load.audio("jump", "assets/player/sfx/jump.wav");
    this.load.audio("hit", "assets/player/sfx/hit.wav");
  }
  //=========================create
  create() {
    this.scene.start("play");
  }
}
