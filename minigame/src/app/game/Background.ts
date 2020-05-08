import { Box, IBox, Position } from '../common/models';

export class Background {
  public box: Box;

  constructor(
    private canvas: HTMLCanvasElement,
    private wallSprite: HTMLImageElement,
    private cloudSprite: HTMLImageElement,
  ) {
    this.box = new Box('rgb(76, 167, 232)', new Position(0, 0, this.canvas.width, this.canvas.height));
  }

  private wallAnnimation = 0;
  private drawWall(ctx: CanvasRenderingContext2D, distance: number) {

    const width = 150;
    const height = 150;

    for (let left = 0; left < (this.canvas.width + width); left = left + width) {
      ctx.drawImage(
        this.wallSprite,
        0, 0, // Start at 0/0 pixels from the left and the top of the image (crop),
        this.wallSprite.width, this.wallSprite.height, // "Get" a `50 * 50` (w * h) area from the source image (crop),
        left - (this.wallAnnimation), (this.canvas.height - height), // place top,left in the canvas,
        width, height // width,height  (scale)
      );
    }

    this.wallAnnimation++;
    if (this.wallAnnimation >= width) { this.wallAnnimation = 0; }

  }

  private drawClouds(ctx: CanvasRenderingContext2D, distance: number) {
    return
    /*
    const width = 150;
    const height = 150;

    for (let left = 0; left < (this.canvas.width + width); left = left + width) {
      ctx.drawImage(
        this.cloudSprite,
        0, 0, // Start at 0/0 pixels from the left and the top of the image (crop),
        this.cloudSprite.width, this.cloudSprite.height, // "Get" a `50 * 50` (w * h) area from the source image (crop),
        left - this.wallAnnimation, 0, // place top,left in the canvas,
        width, height // width,height  (scale)
      );
    }
    this.wallAnnimation++;
    if (this.wallAnnimation >= width) { this.wallAnnimation = 0; }
    */
  }

  draw(ctx: CanvasRenderingContext2D, distance: number) {
    //var ptrn = ctx.createPattern(this.sprite, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    this.box.draw(ctx);
    this.drawClouds(ctx, distance);
    this.drawWall(ctx, distance);
  }
}
