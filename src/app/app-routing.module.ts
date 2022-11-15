import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './auth/auth.component'
import { AuthGuard } from './auth/auth.guard'
import { DetailListComponent } from './recipe/detail-list/detail-list.component'
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component'
import { RecipeStartComponent } from './recipe/recipe-start/recipe-start.component'
import { RecipeComponent } from './recipe/recipe.component'
import { RecipesResolverService } from './recipes-resolver.service'
import { ShoppingListComponent } from './shopping-list/shopping-list.component'

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    // rule we give so it redirects only if the full path is empty
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    component: RecipeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RecipeStartComponent
      },
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':id',
        component: DetailListComponent,
        resolve: [RecipesResolverService]
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService]
      },
    ]
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
