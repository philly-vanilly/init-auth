import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecComponent} from './sec.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [SecComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SecComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ]
})
export class SecModule { }
