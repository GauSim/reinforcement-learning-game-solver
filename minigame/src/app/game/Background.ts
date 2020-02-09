import { Box, IBox, Position } from './models';

export class Background {
  public box: Box;

  private n = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private sprite: HTMLImageElement,
  ) {
    this.box = new Box('rgb(76, 167, 232)', new Position(0, 0, this.canvas.width, this.canvas.height));
  }

  draw(ctx: CanvasRenderingContext2D) {

    //var ptrn = ctx.createPattern(this.sprite, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    this.box.draw(ctx);
    const width = 150;
    const height = 150;

    for (let left = 0; left < (this.canvas.width + width); left = left + width) {
      ctx.drawImage(
        this.sprite,
        0, 0, // Start at 0/0 pixels from the left and the top of the image (crop),
        this.sprite.width, this.sprite.height, // "Get" a `50 * 50` (w * h) area from the source image (crop),
        left - this.n, (this.canvas.height - height),     // Place the result at 0, 0 in the canvas,
        width, height // With as width / height: 100 * 100 (scale)
      );
    }

    this.n++;
    if (this.n >= width) { this.n = 0; }
  }
}
