import { Box, Position } from '../common/models';
import { Enemy } from './Enemy';
import { Player } from './Player';

export class Stats {

  points: number = 0;

  constructor(private canvas: HTMLCanvasElement) { }

  draw(ctx: CanvasRenderingContext2D, distance: number, player: Player, enemies: Enemy[]) {

    this.points = enemies.filter(b => b.isOutOfSight === true).length * 20;

    ctx.font = "20px Arial";
    ctx.fillText(`points: ${this.points}`, this.canvas.width - 200, 50);
    ctx.fillText(`distance: ${distance} m`, this.canvas.width - 200, 100);

    const [first] = enemies.filter(it => it.isOutOfSight === false);
    const distanceToNextBox = first.box.pos.left - (player.box.pos.left + player.box.pos.width);

    ctx.fillText(`next box: ${distanceToNextBox} m`, this.canvas.width - 200, 150);

  }
}
