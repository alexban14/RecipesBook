import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipe/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipe/store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  firebaseURL = 'https://ng-recipebook-b2c43-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient, private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    const recipes = this.store.dispatch(new RecipeActions.FetchRecipes());
    this.http.put(this.firebaseURL, recipes)
      .subscribe(response => console.log(response));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.firebaseURL).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        });
      }),
      // alows us to execute some code without altering the data that is flowing thru the observable
      tap(recipes => {
        // this.recipeService.setRecipes(recipes)
        this.store.dispatch(new RecipeActions.SetRecipes(recipes))
      })
    );
  }
}
