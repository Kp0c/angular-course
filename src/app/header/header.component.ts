import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from './../auth/store/auth.actions';
import { FetchRecipes, StoreRecipe } from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  collapsed = true;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(newUser => {
        this.isAuthenticated = !!newUser;
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    // this.dataStorageService.saveRecipes();
    this.store.dispatch(new StoreRecipe());
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
