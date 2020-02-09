import { IBox, Box, Position } from "./models";

import { Floor } from "./Floor";

export class Player implements IBox {

  private jumpSpeed = 10;
  private isMoving = false;
  private isMovingUp = false;
  private isMovingDown = false;

  public box: Box;
  public markedForCleanUp = false;

  constructor(private floor: Floor) {

    const height = 30;
    const width = 30;

    // inital pos
    this.box = new Box(
      'red',
      new Position(
        50 + width,
        floor.box.pos.y - height,
        width,
        height
      )
    );

  }

  jump() {
    if (this.isMoving) return;
    this.isMoving = true;
    this.isMovingUp = true;
  }

  draw(ctx: CanvasRenderingContext2D) {

    if (this.isMovingUp) {
      const min = 50;
      let newY = this.box.pos.y - this.jumpSpeed;
      
      newY = newY < min ? min : newY;
      
      if (newY === min) { this.isMovingUp = false; }
      
      setTimeout(() => { this.isMovingDown = true; }, 300)
      
      this.box.pos.y = newY;
    }

    if (this.isMovingDown) {
      let newY = this.box.pos.y + this.jumpSpeed;

      const max = this.floor.box.pos.y - this.box.pos.h;

      if (newY >= max) {
        newY = max;
        this.isMovingDown = false;
        this.isMoving = false;
      }

      this.box.pos.y = newY;
    }

    this.box.draw(ctx);
  }
}