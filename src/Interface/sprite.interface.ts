export interface ISpriteInterface {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
}
