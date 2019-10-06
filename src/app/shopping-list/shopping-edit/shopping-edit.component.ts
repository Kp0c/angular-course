import { Ingridient } from './../../shared/Ingridient.modal';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: false }) form: FormGroup;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingridient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngridientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngridient;

        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit() {
    const newIngridient = new Ingridient(this.form.value.name, this.form.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngridient(newIngridient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngridient(newIngridient));
    }

    this.resetForm();
  }

  onClear() {
    this.resetForm();
  }

  resetForm() {
    this.editMode = false;
    this.form.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.DeleteIngridient());
    }

    this.resetForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
