import Phaser from "phaser";
import { ISpriteInterface } from "../Interface/sprite.interface";

export class Dino extends Phaser.Physics.Arcade.Sprite {
  jumpKeySpace: Phaser.Input.Keyboard.Key;
  jumpKeyArrowUp: Phaser.Input.Keyboard.Key;
  duckKey: Phaser.Input.Keyboard.Key;
  jumpSound: Phaser.Sound.BaseSound;
  hitSound: Phaser.Sound.BaseSound;
  constructor(config: ISpriteInterface) {
    super(config.scene, config.x, config.y, config.texture);
    this.body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this);
    this.init();
    this.setBodySize(60, 90, false);
    this.jumpKeySpace = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.jumpKeyArrowUp = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP,
    );
    this.duckKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN,
    );
    this.jumpSound = this.scene.sound.add("jump");
    this.hitSound = this.scene.sound.add("hit");
    this.CreateAnimation();
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  CreateAnimation() {
    const ConfigRunPlayer = {
      key: "run",
      frameRate: 5,
      repeat: -1,
      frames: this.scene.anims.generateFrameNumbers("playerRun", {
        frames: [2, 3],
      }),
    };
    const ConfigDuckPlayer = {
      key: "duck",
      frameRate: 4,
      repeat: -1,
      frames: this.scene.anims.generateFrameNumbers("playerDuck", {
        frames: [0, 1],
      }),
    };

    this.scene.anims.create(ConfigRunPlayer);
    this.scene.anims.create(ConfigDuckPlayer);
  }
  init() {
    this.setInteractive();
    this.setScale(0.7);
    this.setOrigin(0, 1);
    this.setGravityY(2000);
    this.setCollideWorldBounds(true);
  }
  update() {
    if ((this.body as Phaser.Physics.Arcade.Body).onFloor()) {
      if (this.jumpKeyArrowUp.isDown || this.jumpKeySpace.isDown) {
        this.setVelocityY(-1000);
        this.setBodySize(44, 90);
        this.setOffset(22, 0);
        this.jumpSound.play();
      }
      if (this.duckKey.isDown) {
        if (this.body.deltaAbsY() <= 0) {
          this.setBodySize(115, 58);
          this.setOffset(3, 32);
        }
      } else {
        if (this.duckKey.isUp) {
          if (this.body.deltaAbsY() <= 0) {
            this.setBodySize(44, 90);
            this.setOffset(22, 0);
          }
        }
      }
    }
    if (this.body.deltaAbsY() > 0) {
      this.anims.stop();
      this.setTexture("playerRun", 0);
    } else {
      if (this.body.height > 58) this.play("run", true);
      else this.play("duck", true);
    }
  }
}
