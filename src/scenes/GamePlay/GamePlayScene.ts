import Phaser from "phaser";
import { Cloud } from "../../Objects/Cloud";
import { Ground } from "../../Objects/Ground";
import Obstacles from "../../Objects/Obstacles";
import { Dino } from "../../Objects/Player";
import { Score } from "../../Objects/Score";
export default class GamePlayScene extends Phaser.Scene {
  player?: Dino;
  ground?: Phaser.GameObjects.TileSprite;
  clouds?: Phaser.GameObjects.Group;
  test: boolean = false;
  gameSpeed: number = 2;
  isGameRunning: boolean = true;
  gapCloud: number = 0;
  scoreText?: Score;
  hightScoreText?: Score;
  obstacles?: Phaser.GameObjects.Group;
  respawnTime: number = 1000;
  isGamePlay: boolean = true;
  hitSound?: Phaser.Sound.BaseSound;

  textGameOver?: Phaser.GameObjects.Image;
  btnRestart?: Phaser.GameObjects.Image;

  constructor() {
    super("play");
  }
  /*==============create======================= */
  create() {
    //Game Object
    this.createAnis();
    this.createSound();
    //background
    this.createCloud();
    this.createGround();
    //Play and enemy
    this.player = new Dino({
      scene: this,
      x: 15,
      y: 350,
      texture: "player",
    });
    this.obstacles = this.physics.add.group();
    //score, hight score
    this.createScoreText();
    this.createHightScoreText();
    //GameOver screen
    this.createGameOver();
    //handle event
    this.handleScore();
    this.handleColliders();
    //event input
    this.createEventMouse();
  }
  init() {
    this.isGamePlay = true;
    this.anims.resumeAll();
    this.physics.resume();
  }
  /*=============create============ */
  createGameOver() {
    this.textGameOver = this.add
      .image(400, 150, "textGameOver")
      .setScale(0.7)
      .setAlpha(0);
    this.btnRestart = this.add.image(400, 230, "btnRestart").setAlpha(0);
  }
  createEventMouse() {
    this.input.on("pointerdown", (e: Phaser.Input.Pointer) => {
      if (!this.isGamePlay)
        if (e.downX > 300 && e.downX < 500 && e.downY > 150 && e.downY < 250) {
          this.scene.start("preloadStart");
        }
    });
  }
  //create Sound
  createSound() {
    this.hitSound = this.sound.add("hit");
  }
  //Handle Collider
  handleColliders() {
    if (this.player && this.obstacles) {
      this.physics.add.collider(this.player, this.obstacles, () => {
        this.isGamePlay = false;
        if (this.scoreText && this.hightScoreText)
          if (this.scoreText.getScore() > this.hightScoreText.getScore()) {
            this.hightScoreText.setText(`HI ${this.scoreText.text}`);
            this.hightScoreText.setScore(
              Math.max(
                this.hightScoreText.getScore(),
                this.scoreText.getScore(),
              ),
            );
          }
        this.player?.setTexture("playerRun");
        this.textGameOver?.setAlpha(1);
        this.btnRestart?.setAlpha(1);
        this.hitSound?.play();
        this.physics.pause();
        this.anims.pauseAll();
        this.gameSpeed = 2;
        this.scoreText?.setScore(0);
      });
    }
  }
  //create ScoreText
  createScoreText() {
    this.scoreText = new Score({
      scene: this,
      x: 760,
      y: 10,
      text: "00000",
      style: {
        font: "900 30px Courier",
        resolution: 5,
        color: "#535353",
      },
    });
  }
  //create HeightScoreText
  createHightScoreText() {
    let text;
    this.hightScoreText
      ? (text = this.hightScoreText.text)
      : (text = "HI 00000");
    this.hightScoreText = new Score({
      scene: this,
      x: 650,
      y: 10,
      text,
      style: {
        font: "900 30px Courier",
        resolution: 5,
        color: "#535353",
      },
    });
  }
  //create Cloud
  createCloud() {
    this.clouds = this.add.group();
    let distance = 300;
    for (let i = 0; i < 5; i++) {
      let randomY = Phaser.Math.Between(50, 170),
        randomX = Phaser.Math.Between(distance, distance + 400);
      this.addCloud(randomY, randomX);
      distance = randomX;
    }
  }
  addCloud(x: number, y: number) {
    let randomScale = Math.random() + 0.3;
    let randomVelocity = this.gameSpeed + Math.random() + 0.2;
    this.clouds?.add(
      new Cloud({
        scene: this,
        x,
        y,
        texture: "cloud",
      })
        .setScale(randomScale)
        .setVelocityCloud(randomVelocity),
    );
  }

  //Animation
  createAnis() {
    //animation enemy bird
    const configFlyBird = {
      key: "fly",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("bird", { frames: [0, 1] }),
    };
    this.anims.create(configFlyBird);
  }
  //ground
  createGround() {
    this.ground = new Ground({
      scene: this,
      x: 0,
      y: 405,
      width: 1600,
      height: 30,
      texture: "ground",
    });
  }
  //create Enemy
  createEnemy() {
    let { width, height } = this.game.config;
    const enemyNumber = Phaser.Math.Between(0, 6);
    const distance = Phaser.Math.Between(600, 900);
    let obstacles: Obstacles;
    //create bird
    if (enemyNumber > 5) {
      const birdHeight = [20, 50];
      obstacles = new Obstacles({
        scene: this,
        x: (width as number) + distance,
        y: (height as number) - birdHeight[Phaser.Math.Between(0, 1)],
        texture: "enemy-bird",
      });
      obstacles.play("fly");
      obstacles.body.setSize(50, 60);
      this.obstacles?.add(obstacles);
    } else {
      //create cactus
      obstacles = new Obstacles({
        scene: this,
        x: (width as number) + distance,
        y: height as number,
        texture: `cactuses${enemyNumber}`,
      });
      obstacles.body.offset.y = +10;
      this.obstacles?.add(obstacles);
    }
    obstacles.setImmovable();
  }

  /*==================update================= */
  update(time: number, delta: number): void {
    if (!this.isGamePlay) return;
    this.player?.update();
    this.ground?.update(this.gameSpeed);
    this.updateCloud();
    this.updateEnemey(time, delta);
  }
  //Update Cloud
  updateCloud() {
    if (this.clouds) {
      this.clouds
        .getChildren()
        .forEach((env: Phaser.GameObjects.GameObject, index: number) => {
          const child: Phaser.GameObjects.Image =
            env as Phaser.GameObjects.Image;
          let randomScale = Math.random() + 0.5;
          child.update(this.gapCloud, randomScale);
          this.gapCloud = child.width * randomScale;
        });
    }
  }
  //Update Enemy
  updateEnemey(time: number, delta: number) {
    if (this.obstacles) {
      this.obstacles.getChildren().forEach((_e) => {
        let child = _e as Phaser.Physics.Arcade.Sprite;
        child.update(this.gameSpeed);
      });
    }
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1000) {
      this.createEnemy();
      this.respawnTime = 0;
    }
    if (this.obstacles) {
      this.obstacles
        .getChildren()
        .forEach((obstacle: Phaser.GameObjects.GameObject) => {
          let child = obstacle as
            | Phaser.Physics.Arcade.Sprite
            | Phaser.Physics.Arcade.Image;
          if (child.getBounds().right < 0)
            this.obstacles?.killAndHide(obstacle);
        });
    }
  }
  //handle Score
  handleScore() {
    this.time.addEvent({
      delay: 1000 / 7,
      loop: true,
      callback: () => {
        if (!this.isGamePlay) return;

        this.gameSpeed += 0.01;
        this.scoreText?.updateScore();
      },
    });
  }
}
