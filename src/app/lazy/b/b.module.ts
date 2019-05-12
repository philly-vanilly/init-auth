import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {BComponent} from './b.component';

@NgModule({
  declarations: [BComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ]
})
export class BModule { }
