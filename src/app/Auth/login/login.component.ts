import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { AuthenticateService } from '../Authenticate.service';
import {User} from '../User.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy {

  isLoading;
  loginForm: FormGroup;
  fgEmail: FormGroup;
  fgPassword: FormGroup;
  submitted = false;
  errorDataSubs: Subscription;
  errorData: { message: string; isErrorMessage: boolean; fadingTime: number; };


  constructor(private formBuilder: FormBuilder, public authService: AuthenticateService, private router: Router) { }

  ngOnInit() {
  this.loginForm = this.initLoginForm();
  this.handleErrorMessage();

  }

  get f() { return this.loginForm.controls; }


handleErrorMessage() {
  this.errorDataSubs = this.authService.getMessageListener()
  .subscribe(errorData => {
    this.errorData = errorData;
    setTimeout(() => {
      this.errorData = undefined;
    }, errorData.fadingTime);
  });
}


  initLoginForm() {
    return this.formBuilder.group({
      fgEmail: this.fgEmail = this.formBuilder.group({
        emailCtrl: ['', [Validators.required, Validators.email]],
      }),

     fgPassword: this.fgPassword = this.formBuilder.group({
        passwordCtrl: ['', Validators.required]
      })
    });
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const user: User = {
      email: this.fgEmail.value.emailCtrl,
      password: this.fgPassword.value.passwordCtrl
    };
    this.isLoading = true;
    this.authService.login(user);
    this.isLoading = false;
}


ngOnDestroy() {
  this.errorDataSubs.unsubscribe();
}
}
