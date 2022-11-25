import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store'
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private igChangeSub: Subscription;

  constructor(private store: Store<fromShoppingList.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   )
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void {
      // this.igChangeSub.unsubscribe();
  }
}
