import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NeuralNetwork, Model, Academy } from "reimprovejs/dist/reimprove.js"
import { Box, Position } from '../common/models';
type Pos = { x: number, y: number, txt: string, heat: number };
let MAP_SIZE = 5;


function randomPoint() {
  let min = 0;
  let max = MAP_SIZE;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function jumpDistance(x1, y1, x2, y2) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

@Component({
  selector: 'app-root',
  templateUrl: './visual.component.html',
  styles: [
    `
    canvas { border: 1px solid red; } 
    `
  ]
})
export class VisualComponent implements OnInit {
  // Render Vars
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId: number;
  renderScale = 50;
  posList: Map<string, Pos> = new Map();

  // AI Vars
  steps = 0
  actor = { x: 0, y: 0 };
  target = { x: randomPoint(), y: randomPoint() };
  distance = jumpDistance(this.actor.x, this.actor.y, this.target.x, this.target.y);
  avgSteps = [];
  hitTotal = 0;
  trainFn: Function;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {

    this.canvas.nativeElement.height = (MAP_SIZE * this.renderScale) + this.renderScale
    this.canvas.nativeElement.width = (MAP_SIZE * this.renderScale) + this.renderScale
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.trainFn = this.setupAI();

    
    this.ctx.font = "9px Arial";
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => { this.tick(); }, 1);
  }

  _draw(p: Pos, color: string) {
    const box = new Box(color, new Position(
      (p.x * this.renderScale), (p.y * this.renderScale),
      this.renderScale, this.renderScale
    ));
    box.draw(this.ctx);
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      p.txt,
      box.pos.left + (box.pos.width / 2),
      box.pos.top + (box.pos.height / 2)
    );
  }

  tick() {
    this.trainFn();

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this._draw({ ...this.target, txt: 'X', heat: 1 }, 'red');
    this.posList.forEach(p => this._draw(p, `rgba(76, 167, 232, ${1 - (p.heat * .1) + .1})`));

    this.requestId = requestAnimationFrame(() => this.tick);
  }

  size(n) {
    MAP_SIZE += n;
    this.canvas.nativeElement.height = (MAP_SIZE * this.renderScale) + this.renderScale
    this.canvas.nativeElement.width = (MAP_SIZE * this.renderScale) + this.renderScale
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
  }

  setupAI() {

    const numActions = 4;
    const inputSize = 4;

    // The window of data which will be sent yo your agent. 
    // For instance the x previous inputs, and what actions the agent took  
    const temporalWindow = 15;

    const totalInputSize = inputSize * temporalWindow + numActions * temporalWindow + inputSize;

    const network = new NeuralNetwork();
    network.InputShape = [totalInputSize];
    network.addNeuralNetworkLayers([
      { type: 'dense', units: 32, activation: 'relu' },

      // { type: 'dense', units: 32, activation: 'relu' },
      // { type: 'dense', units: 32, activation: 'relu' },

      { type: 'dense', units: numActions, activation: 'softmax' }
    ]);

    // Now we initialize our model, and start adding layers
    const modelFitConfig = {
      epochs: 1,
      stepsPerEpoch: 16
    };
    const model = new Model.FromNetwork(network, modelFitConfig);

    // Finally compile the model, we also exactly use tfjs's optimizers and loss functions
    // (So feel free to choose one among tfjs's)
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

    // Every single field here is optionnal, and has a default value. Be careful, it may not fit your needs ...
    const teacherConfig = {
      lessonsQuantity: 10000,   // Number of training lessons before only testing agent
      lessonLength: 20,         // The length of each lesson (in quantity of updates)
      lessonsWithRandom: 2,     // How many random lessons before updating epsilon's value
      epsilon: 1,             // Q-Learning values and so on ...
      epsilonDecay: 0.995,      // (Random factor epsilon, decaying over time)
      epsilonMin: 0.05,
      gamma: 1                // (Gamma = 1 : agent cares really much about future rewards)
    };

    const agentConfig = {
      model: model,
      agentConfig: {
        memorySize: 1000,                      // The size of the agent's memory (Q-Learning)
        batchSize: 128,                        // How many tensors will be given to the network when fit
        temporalWindow: temporalWindow         // The temporal window giving previous inputs & actions
      }
    };

    // First we need an academy to host everything
    const academy = new Academy();
    const teacher = academy.addTeacher(teacherConfig);
    const agent = academy.addAgent(agentConfig);
    academy.assignTeacherToAgent(agent, teacher);

    const loop = async () => {

      // Gather inputs
      let distance_before = Math.hypot(this.target.x - this.actor.x, this.target.y - this.actor.y);
      let inputs = [this.actor.x, this.actor.y, this.target.x, this.target.y];


      if (inputs.length !== inputSize) {
        throw new Error("The Input Size dose not match the Inputs Array length")
      }


      // Step the learning
      let result = await academy.step([{ teacherName: teacher, agentsInput: inputs }]);

      // Take Action
      if (result !== undefined) {
        this.steps++;
        var action = result.get(agent);
        if (action === 0) {
          this.actor.x++; // Right
        } else if (action === 1) {
          this.actor.x--; // Left
        } else if (action === 2) {
          this.actor.y++; // Down
        } else if (action === 3) {
          this.actor.y--; // Up
        }
      }

      if (this.actor.x < 0)
        this.actor.x = 0;
      else if (this.actor.x > MAP_SIZE)
        this.actor.x = MAP_SIZE;

      if (this.actor.y < 0)
        this.actor.y = 0;
      else if (this.actor.y > MAP_SIZE)
        this.actor.y = MAP_SIZE;

      let distance_after = Math.hypot(this.target.x - this.actor.x, this.target.y - this.actor.y)


      let reward = (distance_before == distance_after)
        ? -0.1
        : distance_before - distance_after;

      /*
      distance_after < distance_before
        ? 10.00
        : this.posList.has(`(${this.actor.x}, ${this.actor.y})`)
          ? -0.25
          : -10.00
      */

      academy.addRewardToAgent(agent, reward);

      // took longer then a^2+b^2 = c^2, 2c is the longes way
      const maxStepsTimeout = this.steps >= ((MAP_SIZE * MAP_SIZE)*4)
      if (maxStepsTimeout) {
        academy.addRewardToAgent(agent, -.1);
      }



      this.posList.set(`(${this.actor.x}, ${this.actor.y})`, { ...this.actor, txt: `${this.steps}`, heat: distance_after });

      //console.info(`Target: (${target.x}, ${target.y}) Location: (${actor.x}, ${actor.y}) Reward: ${reward}`);

      if (
        this.actor.x === this.target.x && this.actor.y === this.target.y
        ||
        // reset took to long
        maxStepsTimeout
      ) {
        //console.info(`Target: ${distance} Steps: ${steps} Delta: ${(steps - distance)}`);

        // clean screen
        this.posList = new Map();

        const next = { x: randomPoint(), y: randomPoint() };

        this.avgSteps.push(this.steps);

        const all = this.avgSteps.reduce((all, it) => all + it, 0);
        const avg = all / this.avgSteps.length;

        if (!maxStepsTimeout) {
          this.hitTotal++
        }
        console.log(`
        ${!maxStepsTimeout ? ('*'.repeat(10) + 'HIT' + '*'.repeat(10)) : ''}
        Done: ${this.steps} 
        HIT: ${!maxStepsTimeout}
        distance: ${this.distance}
        Target: (${this.target.x}, ${this.target.y}) 
        Location: (${this.actor.x}, ${this.actor.y})
        hitTotal:${this.hitTotal}    
        runsTotal:${this.avgSteps.length}
        avgStep: ${avg.toFixed(2)}
        best: ${this.avgSteps.reduce((min, it) => it < min ? it : min, Infinity)}
        worse: ${this.avgSteps.reduce((max, it) => it > max ? it : max, 0)} 
        `);


        this.target = next;
        this.steps = 0;
        this.distance = jumpDistance(this.actor.x, this.actor.y, this.target.x, this.target.y);

      }

    }

    return loop;
  }
}
