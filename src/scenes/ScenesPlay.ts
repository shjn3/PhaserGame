import Phaser from "phaser";
export default class ScenesPlay extends Phaser.Scene {
  player?: Phaser.Physics.Arcade.Sprite;
  ground?: Phaser.GameObjects.TileSprite;
  clouds?: Phaser.GameObjects.Group;
  test: boolean = false;
  gameSpeed: number = 2;
  isGameRunning: boolean = true;
  gapCloud: number = 0;
  score: number = 0;
  hightScore: number = 0;
  scoreText?: Phaser.GameObjects.Text;
  hightScoreText?: Phaser.GameObjects.Text;
  obstacles?: Phaser.GameObjects.Group;
  respawnTime: number = 1000;
  isGamePlay: boolean = true;
  jumpSound?: Phaser.Sound.BaseSound;
  hitSound?: Phaser.Sound.BaseSound;

  textGameOver?: Phaser.GameObjects.Image;
  btnRestart?: Phaser.GameObjects.Image;

  constructor() {
    super("play");
  }
  /*==============create======================= */
  create() {
    //background
    this.createCloud();
    this.createGround();
    //Game Object
    this.createAnis();
    this.createSound();
    //Play and enemy
    this.createPlayer();
    this.obstacles = this.physics.add.group();
    //score, hight score
    this.createScoreText();
    this.createHightScoreText();
    //Over screen
    this.createGameOver();
    //handle
    this.handleScore();
    this.handleColliders();
    //event input
    this.createEventKeyboard();
    this.createEventMouse();
  }
  init() {
    this.isGamePlay = true;
    this.anims.resumeAll();
    this.physics.resume();
  }
  createGameOver() {
    this.textGameOver = this.add
      .image(400, 150, "textGameOver")
      .setScale(0.7)
      .setAlpha(0);
    this.btnRestart = this.add.image(400, 230, "btnRestart").setAlpha(0);
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
        if (Number(this.scoreText?.text) > this.hightScore) {
          this.hightScoreText?.setText(`HI ${this.scoreText?.text}`);
          this.hightScore = Math.max(this.hightScore, this.score);
        }
        this.textGameOver?.setAlpha(1);
        this.btnRestart?.setAlpha(1);

        this.hitSound?.play();
        this.physics.pause();
        this.anims.pauseAll();
        this.player?.setTexture("playerRun", 0);
        this.gameSpeed = 2;
        this.score = 0;
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
    let text;
    this.hightScoreText
      ? (text = this.hightScoreText.text)
      : (text = "HI 00000");

    this.hightScoreText = this.add
      .text(640, 10, text, {
        font: "900 30px Courier",
        resolution: 5,
        color: "#535353",
      })
      .setOrigin(1, 0);
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
              this.player.setVelocityY(-1000);
              this.player.setBodySize(44, 90);
              this.player.setOffset(22, 0);
              this.jumpSound?.play();
            }
            break;
          case "ArrowDown":
            if (this.player) {
              if (!(this.player.body as Phaser.Physics.Arcade.Body).onFloor())
                return;

              this.player.setBodySize(115, 58);
              this.player.setOffset(3, 32);
            }
            break;
        }
      }
    });
    this.input.keyboard.on("keyup", (e: KeyboardEvent) => {
      if (this.isGamePlay) {
        switch (e.key) {
          case "ArrowDown":
            if (this.player) {
              if (!(this.player.body as Phaser.Physics.Arcade.Body).onFloor())
                return;
              this.player.setBodySize(44, 90);
              this.player.setOffset(22, 0);
            }
            break;
        }
      }
    });
  }
  createEventMouse() {
    this.input.on("pointerdown", (e: Phaser.Input.Pointer) => {
      if (!this.isGamePlay)
        if (e.downX > 300 && e.downX < 500 && e.downY > 150 && e.downY < 250) {
          this.scene.start("preloadStart");
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
      .setGravityY(2000);
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
          "enemy-bird",
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
          `cactuses${enemyNumber}`,
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
      this.updateEnemey(time, delta);
    }
  }
  //Update Enemy
  updateEnemey(time: number, delta: number) {
    if (this.obstacles) {
      this.obstacles.getChildren().forEach((_e) => {
        let child: Phaser.Physics.Arcade.Sprite =
          _e as Phaser.Physics.Arcade.Sprite;
        if (child.texture.key === "bird") {
          child.x -= this.gameSpeed + 1;
        } else {
          child.x -= this.gameSpeed;
        }
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
      Phaser.Actions.IncX(this.clouds?.getChildren(), -this.gameSpeed - 1);
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
    if (!this.isGamePlay) return;
    if (this.player) {
      if (this.player.body.deltaAbsY() > 0) {
        this.player.anims.stop();
        this.player.setTexture("playerRun", 0);
      } else {
        if (this.player.body.height <= 58) this.player.play("duck", true);
        else this.player.play("run", true);
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
