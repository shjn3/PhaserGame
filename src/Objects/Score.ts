import { ITextInterface } from "../Interface/text.interface";

export class Score extends Phaser.GameObjects.Text {
  score: number = 0;
  constructor(config: ITextInterface) {
    super(config.scene, config.x, config.y, config.text, config.style);
    this.setOrigin(1, 0);
    this.scene.add.existing(this);
  }
  setScore(score: number) {
    this.score = score;
    return this;
  }
  getScore() {
    return this.score;
  }
  updateScore() {
    this.score++;
    const score = Array.from(String(this.score), Number);
    for (let i = 0; i < 5 - String(this.score).length; i++) {
      score.unshift(0);
    }
    this.setText(score.join(""));
  }
}
