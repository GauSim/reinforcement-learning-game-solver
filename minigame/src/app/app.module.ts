import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GameComponent } from './game/game.component';
import { VisualComponent } from './visual/visual.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { RootComponent } from './routing/root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    GameComponent,
    VisualComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [
    RootComponent
  ]
})
export class AppModule { }
