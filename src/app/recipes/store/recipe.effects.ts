import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FETCH_RECIPES, SetRecipes, STORE_RECIPES } from './recipe.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(environment.recipesUrl + 'recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingridients: recipe.ingridients ? recipe.ingridients : []};
      });
    }),
    map(recipes => {
      return new SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(environment.recipesUrl + 'recipes.json', recipesState.recipes);
    })
  )

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<AppState>) {}
}
