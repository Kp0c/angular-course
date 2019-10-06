import { Ingridient } from './../../shared/Ingridient.modal';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingridients: Ingridient[];
  editedIngridient: Ingridient;
  editedIngridientIndex: number;
}

const initialState: State = {
  ingridients: [
    new Ingridient('initial', 1)
  ],
  editedIngridient: null,
  editedIngridientIndex: -1,
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGRIDIENT:
      return {
        ...state,
        ingridients: [
          ...state.ingridients,
          action.payload
        ]
      };
    case ShoppingListActions.ADD_INGRIDIENTS:
      return {
        ...state,
        ingridients: [
          ...state.ingridients,
          ...action.payload
        ]
      };
    case ShoppingListActions.UPDATE_INGRIDIENT:
      const ingridient = state.ingridients[state.editedIngridientIndex];
      const updatedIngridient = {
        ...ingridient,
        ...action.payload
      };

      const updatedIngridients = [...state.ingridients];
      updatedIngridients[state.editedIngridientIndex] = updatedIngridient;

      return {
        ...state,
        ingridients: updatedIngridients,
        editedIngridient: null,
        editedIngridientIndex: -1,
      };
    case ShoppingListActions.DELETE_INGRIDIENT:
      return {
        ...state,
        ingridients: [...state.ingridients.filter((ig, index) => index !== state.editedIngridientIndex)],
        editedIngridient: null,
        editedIngridientIndex: -1,
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngridient: { ...state.ingridients[action.payload] },
        editedIngridientIndex: action.payload
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngridient: null,
        editedIngridientIndex: -1
      };
    default:
      return state;
  }
}
