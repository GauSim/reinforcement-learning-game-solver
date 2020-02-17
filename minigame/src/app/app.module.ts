import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GameComponent } from './game/game.component';
import { VisualComponent } from './visual/visual.component';

@NgModule({
  declarations: [
    GameComponent,
    VisualComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    //PointFinderComponent
    VisualComponent 
    // GameComponent //  // 
  ]
})
export class AppModule { }
