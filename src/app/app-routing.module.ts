import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WorkspaceComponent} from "./workspace/workspace.component";
import {RouthComponent} from "./routh/routh.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {path: 'signal-flow-graph',component: WorkspaceComponent},
  {path: 'routh-herwitz',component: RouthComponent},
  {path: "", redirectTo: 'signal-flow-graph', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
