import { IBox, Position, Box } from '../common/models';

export class Floor implements IBox {
  public box: Box;
  constructor(private canvas: HTMLCanvasElement) {
    const h = 5;
    this.box = new Box('black', new Position(0, (this.canvas.height - h), this.canvas.width, h));
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.box.draw(ctx);
  }
}
