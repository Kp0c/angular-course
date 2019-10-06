import { SetRecipes } from './../recipes/store/recipe.actions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private url = 'https://ng-complete-guide-52278.firebaseio.com/';

  constructor(private http: HttpClient,
              private store: Store<AppState>) {}

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url + 'recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingridients: recipe.ingridients ? recipe.ingridients : []};
        });
      }),
      tap(recipes => {
        // this.recipeService.setRecipes(recipes);
        this.store.dispatch(new SetRecipes(recipes));
      }));
  }
}
