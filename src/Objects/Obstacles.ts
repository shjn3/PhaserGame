import { ISpriteInterface } from "../Interface/sprite.interface";

export default class Obstacles extends Phaser.Physics.Arcade.Sprite {
  constructor(config: ISpriteInterface) {
    super(config.scene, config.x, config.y, config.texture);
    this.setScale(0.7).setOrigin(0, 1);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  update(speed: number) {
    if (this.texture.key === "bird") this.x -= speed + 1;
    else this.x -= speed;
  }
}
