export type IBox = {
  draw(ctx: CanvasRenderingContext2D): void;
}

export type IMovable = {
  move(y:number): void;
}


export class Position {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public w: number = 0,
    public h: number = 0
  ) { }
}

export class Box implements IBox {
  constructor(
    public color: 'red' | 'blue' | 'black' = 'red',
    public readonly pos: Position = new Position(0, 0, 0, 0)
  ) { }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.pos.w, this.pos.h);
  }
}
