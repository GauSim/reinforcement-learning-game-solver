export type IBox = {
  draw(ctx: CanvasRenderingContext2D): void;
}

export type IMovable = {
  move(y: number): void;
}

export class Position {
  constructor(
    public left: number = 0,
    public top: number = 0,
    public width: number = 0,
    public height: number = 0
  ) { }
}

export class Box implements IBox {
  constructor(
    public color: 'red' | 'blue' | 'black' | 'transparent' = 'red',
    public readonly pos: Position = new Position(0, 0, 0, 0)
  ) { }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.left, this.pos.top, this.pos.width, this.pos.height);
  }
}
