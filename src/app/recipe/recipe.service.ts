import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import { Store } from "@ngrx/store";
import * as ShoppingListActions	 from "../shopping-list/store/shopping-list.actions";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipie',
  //     'This is a simple test', 'https://www.slimmingworld.co.uk/wp-content/uploads/2022/02/Header-5FaveFreeFoods-SlimmingWorldBlog.jpg',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('Buns', 2),
  //     ]
  //   ),
  //   new Recipe(
  //     'Another Test Recipie',
  //     'This is a simple test',
  //     'https://www.quick-german-recipes.com/images/jagerschnitzel-600-2020.jpg',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20),
  //     ]
  //   )
  // ];

  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    // slice => to return a copy of the recipes and not direct referance
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  delete(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
