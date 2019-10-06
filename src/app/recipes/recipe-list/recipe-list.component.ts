import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSubscription: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    // this.recipes = this.recipeService.getRecipes();
    // this.recipesSubscription = this.recipeService.recipesChanged.subscribe(
    //   (recipes) => {
    //     this.recipes = recipes;
    //   }
    // );

    this.recipesSubscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe(
        (recipes) => {
          this.recipes = recipes;
        }
      );
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

}
