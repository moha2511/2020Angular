import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { AuthenticateService } from '../Authenticate.service';
import { User } from '../User.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  submitted = false;
  authStatusSub: Subscription;
  isLoading = false;
  fgEmail: FormGroup;
  fgPassword: FormGroup;
  message: { message: string; isErrorMessage: boolean; fadingTime: number; };
  messageSubs: Subscription;

  constructor(private formBuilder: FormBuilder, public authService: AuthenticateService) { }

  ngOnInit() {

    this.initSignupForm();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = authStatus;
    });

    this.messageSubs = this.authService.getMessageListener()
    .subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
      }, messageData.fadingTime);
    });

  }
initSignupForm() {
  this.signupForm = this.formBuilder.group({

    fgEmail: this.fgEmail = this.formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]],
    }),

   fgPassword: this.fgPassword = this.formBuilder.group({
      passwordCtrl: ['', Validators.required]
    })
  });
}

  get f() { return this.signupForm.controls; }


  onSignup() {

    if (this.signupForm.invalid) {
      return;
    }
    const user: User = {
      email: this.fgEmail.value.emailCtrl,
      password: this.fgPassword.value.passwordCtrl
    };
    this.isLoading = true;
    this.authService.createUser(user);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.messageSubs.unsubscribe();
  }

}
