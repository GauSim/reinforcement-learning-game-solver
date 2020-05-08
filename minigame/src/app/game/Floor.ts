import { IBox, Position, Box } from '../common/models';

export class Floor implements IBox {
  public box: Box;
  private textureAnnimation = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private sprite: HTMLImageElement
  ) {
    const h = 20;
    this.box = new Box('green', new Position(0, (this.canvas.height - h), this.canvas.width, h));
  }

  private drawTexture(ctx: CanvasRenderingContext2D) {
    const width = this.sprite.width;
    const height = this.sprite.height;

    for (let left = 0; left < (this.canvas.width + width); left = left + width) {
      ctx.drawImage(
        this.sprite,
        0, 0, // Start at 0/0 pixels from the left and the top of the image (crop),
        this.sprite.width, this.sprite.height,
        left - this.textureAnnimation, this.box.pos.top, // place top,left in the canvas,
        width, height // width,height  (scale)
      );
    }

    this.textureAnnimation++;
    if (this.textureAnnimation >= width) { this.textureAnnimation = 0; }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.box.draw(ctx);
    this.drawTexture(ctx);
  }
}
