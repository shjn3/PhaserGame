export interface ITextInterface {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string | string[];
  style: Phaser.Types.GameObjects.Text.TextStyle;
}
