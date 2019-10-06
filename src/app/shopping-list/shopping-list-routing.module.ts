import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ShoppingListComponent } from './shopping-list.component';

const appRoutes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ShoppingListComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ShoppingListRoutingModule {}
