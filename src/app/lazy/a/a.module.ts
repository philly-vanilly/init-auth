import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AComponent} from './a.component';

@NgModule({
  declarations: [AComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ]
})
export class AModule { }
