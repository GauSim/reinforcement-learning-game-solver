import { Box, Position } from "../common/models";
import { Floor } from "./Floor";


type AnimationType = 'walk' | 'jump';

export class Player {

  private spriteIntex = 0;
  private animationType: AnimationType = 'walk';

  private isJumping = false;
  private isJumpingUp = false;
  private isJumpingDown = false;
  private jumpDistanceCurrent = 0;

  public box: Box;

  constructor(
    private floor: Floor,
    private sprite: HTMLImageElement,
  ) {

    const height = 90;
    const width = 40;

    this.box = new Box(
      'transparent',
      new Position(
        50 + width,
        floor.box.pos.top - height,
        width,
        height
      )
    );
  }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.isJumpingUp = true;
    this.jumpDistanceCurrent = 0;
    this.changeAnimation('jump');
  }

  changeAnimation(t: AnimationType) {
    this.animationType = t;
    this.spriteIntex = 0;
  }

  private animate(ctx: CanvasRenderingContext2D, distance: number) {

    const map = new Map<AnimationType, [number, number][]>()
      .set('walk', [
        [0, 100],
        [80, 100],
        [160, 100],
        [240, 100],
        [320, 100],
        [400, 100],
      ])
      .set('jump', [
        [90, 275],
        [170, 275],
      ])

    const sprite = map.get(this.animationType);
    const [left, top] = sprite[this.spriteIntex];

    let nextSpriteIntex = this.spriteIntex;

    switch (this.animationType) {
      case 'walk':
        if (distance % 35 === 0) {
          nextSpriteIntex++
        }
        break;
      case 'jump':
        if (distance % 50 === 0) {
          nextSpriteIntex++
        }
        break;
      default:
        break;
    }

    this.spriteIntex = nextSpriteIntex > (sprite.length - 1)
      ? 0
      : nextSpriteIntex

    const spriteBorderBottom = 9;
    ctx.drawImage(
      this.sprite,
      left, top,
      80, 90,
      this.box.pos.left - 10, (this.box.pos.top + spriteBorderBottom),
      80, 90
    );

  }

  draw(ctx: CanvasRenderingContext2D, distance: number) {
    const maxDistance = 100;

    this.jumpDistanceCurrent = this.isJumping ?
      (this.jumpDistanceCurrent + 1)
      : this.jumpDistanceCurrent

    if (this.isJumping && this.jumpDistanceCurrent > maxDistance) {
      this.isJumpingDown = true;
    }

    const jumpSpeed = 10;

    if (this.isJumpingUp) {
      const minTop = 250; // height of the jump 
      let newTop = this.box.pos.top - jumpSpeed;

      newTop = newTop < minTop
        ? minTop
        : newTop;

      if (newTop === minTop || this.isJumpingDown) { this.isJumpingUp = false; }

      this.box.pos.top = newTop;
    }

    if (this.isJumpingDown) {
      let newTop = this.box.pos.top + jumpSpeed;

      const max = this.floor.box.pos.top - this.box.pos.height;

      if (newTop >= max) {
        newTop = max;
        this.isJumpingDown = false;
        this.isJumping = false;
        this.changeAnimation('walk');
      }

      this.box.pos.top = newTop;
    }

    this.box.draw(ctx);
    this.animate(ctx, distance);

  }
}