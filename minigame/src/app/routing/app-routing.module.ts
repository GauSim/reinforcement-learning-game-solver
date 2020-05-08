import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { GameComponent } from '../game/game.component';
import { VisualComponent } from '../visual/visual.component';
import { RootComponent } from './root.component';



const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'test1', component: VisualComponent },
  { path: '**', redirectTo: 'test1' }
];

// configures NgModule imports and exports
@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }