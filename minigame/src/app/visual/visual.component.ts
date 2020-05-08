import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

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


  constructor(private ngZone: NgZone) { }

  ngOnInit() {


    const policyNet = tf.sequential();

  }

}
