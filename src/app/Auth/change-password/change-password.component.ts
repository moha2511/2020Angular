import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../User.model';
import { AuthenticateService } from '../Authenticate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  fgOldPassword: FormGroup;
  fgNewPassword: FormGroup;
  submitted = false;
  messageSubs: Subscription;
  message: { message: string; isErrorMessage: boolean; fadingTime: number; };

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthenticateService
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.initChangePasswordForm();

    this.messageSubs = this.authService.getMessageListener()
    .subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
      }, messageData.fadingTime);
    });
  }

  initChangePasswordForm() {
    return this.formBuilder.group({
      fgOldPassword: this.fgOldPassword = this.formBuilder.group({
        passwordCtrl: ['', Validators.required]
      }),
      fgNewPassword: this.fgNewPassword = this.formBuilder.group({
        passwordCtrl: ['', Validators.required]
      })
    });
  }
  get f() {
    return this.changePasswordForm.controls;
  }

  onChange() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    const oldPaasword = this.fgOldPassword.value.passwordCtrl;
    const newPassword = this.fgNewPassword.value.passwordCtrl;

    this.authService.changePassword(oldPaasword, newPassword);
  }
}
