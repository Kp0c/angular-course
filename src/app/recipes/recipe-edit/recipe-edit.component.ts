import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingridient } from 'src/app/shared/Ingridient.modal';
import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { UpdateRecipe, AddRecipe } from '../store/recipe.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngridients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipesState => recipesState.recipes.find(recipe => recipe.id === this.id))
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingridients) {
            recipe.ingridients.forEach((ingridient: Ingridient) => {
              recipeIngridients.push(new FormGroup({
                name: new FormControl(ingridient.name, Validators.required),
                amount: new FormControl(ingridient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              }));
            });
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingridients: recipeIngridients
    });
  }

  onSubmit() {
    const recipe = new Recipe(this.recipeForm.value.name,
                              this.recipeForm.value.description,
                              this.recipeForm.value.imagePath,
                              this.recipeForm.value.ingridients);

    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, recipe);
      this.store.dispatch(new UpdateRecipe({index: this.id, recipe}));
    } else {
      // this.recipeService.addRecipe(recipe);
      this.store.dispatch(new AddRecipe(recipe));
    }

    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get ingridientsControls() {
    return (this.recipeForm.get('ingridients') as FormArray).controls;
  }

  onAddIngridient() {
    (this.recipeForm.get('ingridients') as FormArray).push(new FormGroup({
      name: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onRemoveIngridient(index: number) {
    (this.recipeForm.get('ingridients') as FormArray).removeAt(index);
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
