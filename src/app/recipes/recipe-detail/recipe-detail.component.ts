import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { DeleteRecipe } from '../store/recipe.actions';
import { AddIngridients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        // this.selectedRecipe = this.recipeService.getRecipe(+params.id);
        this.store.select('recipes')
        .pipe(
          map(recipesState => recipesState.recipes.find(recipe => recipe.id === +params.id))
          )
        .subscribe(recipe => {
          this.selectedRecipe = recipe;
        });
      }
    );
  }

  toShoppingList() {
    // this.recipeService.addIngridientsToShoppingList(this.selectedRecipe.ingridients);
    this.store.dispatch(new AddIngridients(this.selectedRecipe.ingridients));
  }

  deleteRecipe() {
    // this.recipeService.deleteRecipe(this.selectedRecipe.id);
    this.store.dispatch(new DeleteRecipe(this.selectedRecipe.id));

    this.router.navigate(['/recipes']);
  }

}
