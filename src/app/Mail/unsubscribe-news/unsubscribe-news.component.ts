import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMessageData } from 'src/app/IMessageData.interface';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-unsubscribe-news',
  templateUrl: './unsubscribe-news.component.html',
  styleUrls: ['./unsubscribe-news.component.css']
})
export class UnsubscribeNewsComponent implements OnInit {
  emailFormGroup: FormGroup;
  isSubmitted = false;
  message: IMessageData;
  constructor(private formBuilder: FormBuilder,
              private emailService: EmailService) { }

  ngOnInit() {
    this.emailFormGroup = this.formBuilder.group({
      emailCtrl: [null, [Validators.required, Validators.email]]
    });
    this.listenForMessages();

  }

   /*
   * Listens for messages sent from the event service
   */
  listenForMessages() {
    return this.emailService.getMessageListener().subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
      }, messageData.fadingTime);
      setTimeout(() => {
      }, messageData.fadingTime);
    });
  }

  onUnsubscribe(emailInput: HTMLInputElement) {

    if (this.emailFormGroup.invalid) {
      return;
    }
    this.emailService.unsubscribeNews(emailInput.value);
  }
}
