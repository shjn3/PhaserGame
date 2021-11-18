import Phaser from "phaser";

export default class ScenesPlay extends Phaser.Scene {
  player?: Phaser.Physics.Arcade.Sprite;
  ground?: Phaser.GameObjects.TileSprite;
  clouds?: Phaser.GameObjects.Group;
  test: boolean = false;
  gameSpeed: number = 4;
  isGameRunning: boolean = true;
  gapCloud: number = 0;
  score: number = 0;
  heightScore: number = 0;
  scoreText?: Phaser.GameObjects.Text;
  hightScoreText?: Phaser.GameObjects.Text;
  obstacles?: Phaser.GameObjects.Group;
  respawnTime: number = 1000;
  isGamePlay: boolean = true;
  jumpSound?: Phaser.Sound.BaseSound;
  hitSound?: Phaser.Sound.BaseSound;

  constructor() {
    super("play");
  }
  preload() {
    this.load.spritesheet("playerRun", "assets/player/dino-run.png", {
      frameWidth: 88,
      frameHeight: 90,
    });
    this.load.spritesheet("playerDuck", "assets/player/dino-down.png", {
      frameWidth: 118,
      frameHeight: 90,
    });
    this.load.image("ground", "assets/start/ground.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("cactuses0", "assets/obstacles/cactuses_big_1.png");
    this.load.image("cactuses1", "assets/obstacles/cactuses_big_2.png");
    this.load.image("cactuses2", "assets/obstacles/cactuses_big_3.png");
    this.load.image("cactuses3", "assets/obstacles/cactuses_small_1.png");
    this.load.image("cactuses4", "assets/obstacles/cactuses_small_2.png");
    this.load.image("cactuses5", "assets/obstacles/cactuses_small_3.png");
    this.load.spritesheet("bird", "assets/obstacles/enemy-bird.png", {
      frameWidth: 92,
      frameHeight: 70,
    });
    //load audio
    this.load.audio("jump", "assets/player/sfx/jump.wav");
    this.load.audio("hit", "assets/player/sfx/hit.wav");
    //game Over
    this.load.image("textGameOver", "assets/gameOver/game-over.png");
    this.load.image("btnRestart", "assets/gameOver/restart.png");
  }
  /*==============create======================= */
  create() {
    this.createCloud();
    this.createAnis();
    this.createGround();
    this.createPlayer();
    this.createScoreText();
    this.createHightScoreText();
    this.createEventKeyboard();
    this.createEventMouse();
    this.handleScore();
    this.obstacles = this.physics.add.group();
    this.handleColliders();
    this.createSound();
    this.add.image(400, 150, "textGameOver").setScale(0.7);
    this.add.image(400, 230, "btnRestart");
  }
  //create Sound
  createSound() {
    this.jumpSound = this.sound.add("jump");
    this.hitSound = this.sound.add("hit");
  }
  //Handle Collider
  handleColliders() {
    if (this.player && this.obstacles) {
      this.physics.add.collider(this.player, this.obstacles, () => {
        const highScore = this.hightScoreText?.text.substring(
          this.hightScoreText.text.length - 5
        );
        const newScore =
          Number(this.scoreText?.text) > Number(highScore)
            ? this.scoreText?.text
            : highScore;
        this.hightScoreText?.setText(`HI ${newScore}`);
        this.hitSound?.play();
        this.physics.pause();
        this.anims.pauseAll();
        this.player?.setTexture("playerRun", 0);
        this.gameSpeed = 5;
        // this.score = 0;
        this.isGamePlay = false;
      });
    }
  }
  //create ScoreText
  createScoreText() {
    this.scoreText = this.add
      .text(760, 10, "00000", {
        font: "900 30px Courier",
        resolution: 5,
        color: "#535353",
      })
      .setOrigin(1, 0);
  }
  //create HeightScoreText
  createHightScoreText() {
    if (!this.hightScoreText)
      this.hightScoreText = this.add
        .text(640, 10, "HI 00000", {
          font: "900 30px Courier",
          resolution: 5,
          color: "#535353",
        })
        .setOrigin(1, 0);
    else {
    }
  }
  //create Cloud
  createCloud() {
    this.clouds = this.add.group();
    this.clouds.addMultiple([
      this.add.image(800, 170, "cloud").setOrigin(0, 1),
      this.add.image(700, 80, "cloud").setOrigin(0, 1),
      this.add.image(900, 100, "cloud").setOrigin(0, 1),
      this.add.image(600, 100, "cloud").setOrigin(0, 1),
      this.add.image(1000, 240, "cloud").setOrigin(0, 1),
    ]);
  }
  //event Keyboard
  createEventKeyboard() {
    this.input.keyboard.on("keydown", (e: KeyboardEvent) => {
      if (this.isGamePlay) {
        switch (e.key) {
          case " ":
          case "ArrowUp":
            if (this.player) {
              if (!(this.player.body as Phaser.Physics.Arcade.Body).onFloor())
                return;
              this.player.setVelocityY(-650);
              this.player.setBodySize(44, 90);
              this.player.setOffset(22, 0);
              this.jumpSound?.play();
            }
            break;
          case "ArrowDown":
            if (this.player) {
              if (!(this.player.body as Phaser.Physics.Arcade.Body).onFloor())
                return;
              this.player.play("duck", true);
              this.player.setBodySize(115, 58);
              this.player.setOffset(3, 32);
              this.isGameRunning = false;
            }
            break;
        }
      } else {
        this.isGamePlay = true;
      }
    });
    this.input.keyboard.on("keyup", (e: KeyboardEvent) => {
      if (this.isGamePlay) {
        switch (e.key) {
          case "ArrowDown":
            if (this.player) {
              if (!(this.player.body as Phaser.Physics.Arcade.Body).onFloor())
                return;
              this.player.play("run", true);
              this.player.setBodySize(44, 90);
              this.player.setOffset(22, 0);
              this.isGameRunning = true;
            }
            break;
        }
      }
    });
  }
  createEventMouse() {
    this.input.on("pointerdown", (e: Phaser.Input.Pointer) => {
      if (e.downX > 300 && e.downX < 500 && e.downY > 150 && e.downY < 250) {
        this.scene.start("start");
      }
    });
  }

  //Animation
  createAnis() {
    //animation player
    const ConfigRunPlayer = {
      key: "run",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("playerRun", { frames: [2, 3] }),
    };
    const ConfigDuckPlayer = {
      key: "duck",
      frameRate: 3,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("playerDuck", { frames: [0, 1] }),
    };

    this.anims.create(ConfigRunPlayer);
    this.anims.create(ConfigDuckPlayer);
    //animation enemy bird
    const configFlyBird = {
      key: "fly",
      frameRate: 4,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("bird", { frames: [0, 1] }),
    };
    this.anims.create(configFlyBird);
  }
  //player
  createPlayer() {
    this.player = this.physics.add
      .sprite(15, 315, "player", undefined)
      .play("run")
      .setBodySize(60, 90)
      .setOrigin(0, 1)
      .setScale(0.7)
      .setCollideWorldBounds(true)
      .setGravityY(1000);
  }
  //ground
  createGround() {
    this.ground = this.add
      .tileSprite(0, 405, 1600, 30, "ground")
      .setOrigin(0, 1);
  }
  //create Enemy
  createEnemy() {
    let { width, height } = this.game.config;
    const enemyNumber = this.getRandom(0, 6);
    const distance = this.getRandom(600, 900);
    let obstacles: Phaser.Physics.Arcade.Sprite;
    //create bird
    if (enemyNumber > 5) {
      const birdHeight = [20, 50];
      obstacles = this.obstacles
        ?.create(
          (width as number) + distance,
          (height as number) - birdHeight[this.getRandom(0, 1)],
          "enemy-bird"
        )
        .setOrigin(0, 1)
        .setScale(0.7);
      obstacles.play("fly");
      obstacles.body.setSize(50, 60);
    } else {
      //create cactus
      obstacles = this.obstacles
        ?.create(
          (width as number) + distance,
          height as number,
          `cactuses${enemyNumber}`
        )
        .setScale(0.7)
        .setOrigin(0, 1);
      obstacles.body.offset.y = +10;
    }
    obstacles.setImmovable();
  }

  /*==================update================= */
  update(time: number, delta: number): void {
    if (this.isGamePlay) {
      this.updatePlayer();
      this.updateGround();
      this.updateCloud();
      if (this.obstacles) {
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
      }
      this.updateEnemey(time, delta);
    }
  }
  //Update Enemy
  updateEnemey(time: number, delta: number) {
    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1000) {
      this.createEnemy();
      this.respawnTime = 0;
    }
    if (this.obstacles) {
      this.obstacles
        .getChildren()
        .forEach((obstacle: Phaser.GameObjects.GameObject) => {
          let child:
            | Phaser.Physics.Arcade.Sprite
            | Phaser.Physics.Arcade.Image = obstacle as
            | Phaser.Physics.Arcade.Sprite
            | Phaser.Physics.Arcade.Image;
          if (child.getBounds().right < 0)
            this.obstacles?.killAndHide(obstacle);
        });
    }
  }
  //cloud
  updateCloud() {
    if (this.clouds) {
      Phaser.Actions.IncX(this.clouds?.getChildren(), -3);
      this.clouds
        .getChildren()
        .forEach((env: Phaser.GameObjects.GameObject, index: number) => {
          const child: Phaser.GameObjects.Image =
            env as Phaser.GameObjects.Image;

          if (child.getBounds().right < 0) {
            child.x =
              (this.game.config.width as number) +
              this.gapCloud +
              this.getRandom(50, 200);
            child.y = this.getRandom(100, 300);
            let randomScale = Math.random() + 0.5;
            child.setScale(randomScale);
            this.gapCloud = child.width * randomScale;
          }
        });
    }
  }
  //player
  updatePlayer() {
    if (this.player) {
      if (this.player.body.deltaAbsY() > 0) {
        this.player.anims.stop();
        this.player.setTexture("playerRun", 0);
      } else {
        if (this.isGameRunning) {
          this.player.play("run", true);
        }
      }
    }
  }
  //ground
  updateGround() {
    if (this.ground) this.ground.tilePositionX += this.gameSpeed;
  }
  //handle Score
  handleScore() {
    this.time.addEvent({
      delay: 1000 / 7,
      loop: true,
      callback: () => {
        if (!this.isGamePlay) return;
        this.score++;
        this.gameSpeed += 0.01;

        if (this.scoreText) {
          const score = Array.from(String(this.score), Number);

          for (let i = 0; i < 5 - String(this.score).length; i++) {
            score.unshift(0);
          }
          this.scoreText.setText(score.join(""));
        }
      },
    });
  }

  //random
  getRandom(min: number, max: number) {
    if (min > max) {
      return Math.floor(Math.random() * (min - max + 1)) + max;
    } else {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}
