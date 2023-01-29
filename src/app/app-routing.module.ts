import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderComponent } from './builder/builder.component';

const routes: Routes = [
  { path: '', component: BuilderComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
