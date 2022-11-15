import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take, tap, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipe/recipe.model';
import { RecipeService } from '../recipe/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  firebaseURL = 'https://ng-recipebook-b2c43-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(private recipeService: RecipeService, private http: HttpClient, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
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
      tap(recipes => this.recipeService.setRecipes(recipes))
    );
  }
}
