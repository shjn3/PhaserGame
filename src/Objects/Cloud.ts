import { ISpriteInterface } from "../Interface/sprite.interface";

export class Cloud extends Phaser.GameObjects.Image {
  veloctiy: number = 0;
  constructor(config: ISpriteInterface) {
    super(config.scene, config.x, config.y, config.texture);
    this.setOrigin(0, 1);
    this.scene.add.existing(this);
  }
  setVelocityCloud(velocity: number) {
    this.veloctiy = velocity;
    return this;
  }
  update(gapCloud: number, randomScale: number) {
    if (this.getBounds().right >= 0) {
      this.x -= this.veloctiy;
      return;
    }
    this.x =
      (this.scene.game.config.width as number) +
      gapCloud +
      Phaser.Math.Between(50 + gapCloud, 200 + gapCloud);
    this.y = Phaser.Math.Between(100, 300);
    this.setScale(randomScale);
  }
}
