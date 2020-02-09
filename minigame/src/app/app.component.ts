import { Component, ViewChild, ElementRef, OnInit, NgZone, HostListener } from '@angular/core';
import { IBox, Box, Position, IMovable } from './models';
import { Enemy } from './Enemy';
import { Floor } from './Floor';
import { Player } from './Player';


export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
}

function isCollide(a: Position, b: Position) {
  return !(
    ((a.y + a.h) < (b.y)) ||
    (a.y > (b.y + b.h)) ||
    ((a.x + a.w) < b.x) ||
    (a.x > (b.x + b.w))
  );
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: ['canvas { border-style: solid }']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  requestId: number;
  interval: any;

  isGameOver = true;
  points: number = 0;
  distance: number = 0;
  difficulty = 1;

  speed = 1.5;

  enemies: Enemy[] = [];
  floor: Floor = null;
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
        isCollision = true
      }
    })
    return isCollision;
  }

  tick() {
    if (this.isGameOver) {
      return;
    }
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.distance += 1;
    this.points = this.enemies.filter(b => b.isOutOfSight === true).length * 20;

    this.floor.draw(this.ctx);
    this.player.draw(this.ctx);

    const isCollision = this.isCollision(this.enemies, this.player);

    if (isCollision) { this.isGameOver = true; }

    this.enemies.filter(b => b.isOutOfSight === false)
      .forEach(box => {
        box.move(this.speed);
        box.draw(this.ctx);
      });

    this.ctx.font = "20px Arial";
    this.ctx.fillText(`points: ${this.points}`, this.canvas.nativeElement.width - 200, 50);
    this.ctx.fillText(`distance: ${this.distance} m`, this.canvas.nativeElement.width - 200, 100);


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
    this.floor = new Floor(this.canvas.nativeElement);
    const enemy = new Enemy(this.canvas.nativeElement, this.floor, this.difficulty);
    this.player = new Player(this.floor);

    this.enemies = this.enemies.concat(enemy);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
}
