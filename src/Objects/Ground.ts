import { ITileSpriteInterface } from "../Interface/titleSprite.interface";

export class Ground extends Phaser.GameObjects.TileSprite {
  constructor(config: ITileSpriteInterface) {
    super(
      config.scene,
      config.x,
      config.y,
      config.width,
      config.height,
      config.texture,
    );
    this.setOrigin(0, 1);
    this.scene.add.existing(this);
  }
  update(speed: number) {
    this.tilePositionX += speed;
  }
}
