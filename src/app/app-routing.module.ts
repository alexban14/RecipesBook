import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './auth/auth.component'
import { ShoppingListComponent } from './shopping-list/shopping-list.component'

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    // rule we give so it redirects only if the full path is empty
    pathMatch: 'full'
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent
  },
  {
    path: 'auth',
    component: AuthComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
