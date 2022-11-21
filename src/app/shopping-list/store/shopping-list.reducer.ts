import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions	 from "./shopping-list.actions";

export interface State {
	ingredients: Ingredient[];
	editedIngredient: Ingredient;
	editedIngredientIndex: number;
}

export interface AppState {
	shoppingList: State;
}

// the state of your app should be a js object
const intialState: State = {
	ingredients: [
		new Ingredient('Apple', 5),
		new Ingredient('Tomatoes', 10)
	  ],
	editedIngredient: null,
	editedIngredientIndex: -1,
};

export function shoppingListReducer(state: State = intialState, action: ShoppingListActions.ShoppingListActions) {
	switch (action.type) {
		case ShoppingListActions.ADD_INGREDIENT:
		//because immutability => we make a copy of the initial state and get its properties with the spread operator, here we update the state
			return {
				...state,
				ingredients: [
					...state.ingredients,
					action.payload
				]	
			};
		case ShoppingListActions.ADD_INGREDIENTS:
			return {
				...state,
				ingredients: [
					...state.ingredients,
					...action.payload
				]
			};
		case ShoppingListActions.UPDATE_INGREDIENT:
			const ingredient = state.ingredients[state.editedIngredientIndex];
			const updatedIngredient = {
				...ingredient,
				...action.payload
			};
			const updatedIngredients = [...state.ingredients];
			updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

			return {
				...state,
				ingredients: updatedIngredients,
				editedIngredientIndex: -1,
				editedIngredinet: null
			}
		case ShoppingListActions.DELETE_INGREDIENT:
			return {
				...state,
				ingredients: state.ingredients.filter((ig, igIndex) => {
					return igIndex !== state.editedIngredientIndex;
				}),
				editedIngredientIndex: -1,
				editedIngredinet: null
			}
		case ShoppingListActions.START_EDIT:
			return {
				...state,
				editedIngredientIndex: action.payload,
				editedIngredient: { ...state.ingredients[action.payload] }
			}
		case ShoppingListActions.STOP_EDIT:
			return {
				...state,
				editedIngredient: null,
				editedIngredientIndex: -1
			}
		default:
			return state;
		
	}
}