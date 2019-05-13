import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LazyComponent} from './lazy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LazyComponent,
        children: [
          {
            path: 'a',
            loadChildren: './a/a.module#AModule'
          },
          {
            path: 'b',
            loadChildren: './b/b.module#BModule'
          }
        ]
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ],
  exports: [RouterModule]
})
export class LazyRoutingModule {}
