import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipeActions from './recipe.actions';
import * as fromAppp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
	firebaseURL = 'https://ng-recipebook-b2c43-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

	@Effect()
	fetchRecipe = this.actions$.pipe(
		ofType(RecipeActions.FETCH_RECIPES),
		switchMap(fetchAction => {
			return this.http.get<Recipe[]>(this.firebaseURL)
		}),
		map(recipes => {
			return recipes.map(recipe => {
			  return {
				...recipe,
				ingredients: recipe.ingredients ? recipe.ingredients : []
			  }
			});
		}),
		map(recipes => {
			return new RecipeActions.SetRecipes(recipes);
		})
	);

	@Effect({dispatch: false})
	storeRecipes = this.actions$.pipe(
		ofType(RecipeActions.STORE_RECIPE),
		// merge a value from an observable to this observable
		withLatestFrom(this.store.select('recipe')),
		switchMap(([actionData, recipesState]) => {
			return this.http.put(this.firebaseURL, recipesState.recipes)
		})
	)

	constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromAppp.AppState>) {}
}