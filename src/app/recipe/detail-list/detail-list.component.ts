import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent implements OnInit {
   recipe: Recipe;
   id: any;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // const id = this.route.snapshot.params['id'];
    this.route.params.pipe(
      map(params => {
        return +params['id']; 
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipe');
      }),map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      }))
      .subscribe(recipe => {
          this.recipe = recipe;
          console.log(recipe);
      });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDelete() {
    this.recipeService.delete(this.id);
    this.router.navigate(['/recipes']);
  }

}
