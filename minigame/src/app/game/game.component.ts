import { Component, ViewChild, ElementRef, OnInit, NgZone, HostListener } from '@angular/core';
import { IBox, Box, Position, IMovable } from '../common/models';
import { Enemy } from './Enemy';
import { Floor } from './Floor';
import { Player } from './Player';
import { Stats } from './Stats';
import { Background } from './Background';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
}

function isCollide(a: Position, b: Position) {
  return !(
    ((a.top + a.height) < (b.top)) ||
    (a.top > (b.top + b.height)) ||
    ((a.left + a.width) < b.left) ||
    (a.left > (b.left + b.width))
  );
}

@Component({
  selector: 'app-root',
  templateUrl: 'game.component.html',
  styles: ['canvas { border-style: solid }']
})
export class GameComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSprite', { static: true }) heroSprite: ElementRef<HTMLImageElement>;
  @ViewChild('wallSprite', { static: true }) wallSprite: ElementRef<HTMLImageElement>;

  ctx: CanvasRenderingContext2D;
  requestId: number;
  interval: any;

  isGameOver = true;

  difficulty = 1;

  distance: number = 0;

  enemies: Enemy[] = [];
  floor: Floor = null;
  stats: Stats = null;
  background: Background = null;
  player: Player = null;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => { this.tick(); }, 1);
    this.play();
  }


  isCollision(enemies: Enemy[], player: Player) {
    let isCollision = false;
    enemies.forEach(enemy => {
      if (isCollide(enemy.box.pos, player.box.pos)) {
        isCollision = true;
      }
    })
    return isCollision;
  }

  tick() {
    if (this.isGameOver) {
      return;
    }
    this.distance += 1;

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.background.draw(this.ctx);
    this.floor.draw(this.ctx);
    this.player.draw(this.ctx, this.distance);

    if (this.isCollision(this.enemies, this.player)) { this.isGameOver = true; }

    this.enemies.filter(b => b.isOutOfSight === false)
      .forEach(box => {
        box.move();
        box.draw(this.ctx);
      });

    this.stats.draw(this.ctx, this.distance, this.player, this.enemies);


    if (this.distance % 1000 === 0) {
      this.difficulty += .5;
    }

    if (this.distance % 400 === 0) {
      this.enemies.push(new Enemy(this.canvas.nativeElement, this.floor, this.difficulty))
    }

    this.requestId = requestAnimationFrame(() => this.tick);
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KEY_CODE.RIGHT_ARROW:
        return;
      case KEY_CODE.LEFT_ARROW:
        return;
      case KEY_CODE.UP_ARROW:
        this.player.jump();
        return;
      default:
        return;
    }
  }

  play() {

    this.isGameOver = false;
    this.stats = new Stats(this.canvas.nativeElement);
    this.floor = new Floor(this.canvas.nativeElement);
    this.background = new Background(this.canvas.nativeElement, this.wallSprite.nativeElement);

    /***
    * hero sprite taken from
    * https://opengameart.org/content/2d-hero
    * CC-BY 3.0 & GPL 3.0 by tokka
    * 
    * wall background 
    * https://opengameart.org/content/handpainted-stone-wall-textures
    * CC-BY 4.0 & CC0 by PamNawi
    */

    this.player = new Player(this.floor, this.heroSprite.nativeElement);

    const enemy = new Enemy(this.canvas.nativeElement, this.floor, this.difficulty);
    this.enemies = this.enemies.concat(enemy);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
}


/***
 *
   this.ctx.drawImage(
      img,
      400,100, // Start at 0/0 pixels from the left and the top of the image (crop),
      80, 90, // "Get" a `50 * 50` (w * h) area from the source image (crop),
      0, 0,     // Place the result at 0, 0 in the canvas,
      80, 90 // With as width / height: 100 * 100 (scale)
    );
 *
 */