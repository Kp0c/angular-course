import { Ingridient } from '../../shared/Ingridient.modal';
import { Action } from '@ngrx/store';

export const ADD_INGRIDIENT = '[Shopping List] Add Ingridient';
export const ADD_INGRIDIENTS = '[Shopping List] Add ingridients';
export const UPDATE_INGRIDIENT = '[Shopping List] Update ingridient';
export const DELETE_INGRIDIENT = '[Shopping List] Delete ingridient';
export const START_EDIT = '[Shopping List] Start edit';
export const STOP_EDIT = '[Shopping List] Stop edit';

export class AddIngridient implements Action {
  readonly type = ADD_INGRIDIENT;

  constructor(public payload: Ingridient) { }
}

export class AddIngridients implements Action {
  readonly type = ADD_INGRIDIENTS;

  constructor(public payload: Ingridient[]) { }
}


export class UpdateIngridient implements Action {
  readonly type = UPDATE_INGRIDIENT;

  constructor(public payload: Ingridient) { }
}

export class DeleteIngridient implements Action {
  readonly type = DELETE_INGRIDIENT;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload: number) { }
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions = AddIngridient | AddIngridients | UpdateIngridient| DeleteIngridient | StartEdit | StopEdit;
