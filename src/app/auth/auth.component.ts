import { PlaceholderDirective } from './../shared/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  loginForm: FormGroup;

  private dismissSub: Subscription;
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      if (authState.authError) {
        this.showErrorAlert(authState.authError);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const formValues = this.loginForm.value;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email: formValues.email, password: formValues.password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: formValues.email, password: formValues.password}));
    }

    this.loginForm.reset();
  }

  onHandleError() {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    this.dismissSub.unsubscribe();
    hostViewContainerRef.clear();
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.dismissSub = componentRef.instance.dismiss.subscribe(this.onHandleError.bind(this));
  }

  ngOnDestroy() {
    if (this.dismissSub) {
      this.dismissSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
