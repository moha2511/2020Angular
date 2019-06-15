import { Component, OnInit, Inject } from '@angular/core';
import { MatInput } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Event/event.service';
import { IMyEventRoot } from 'src/app/Event/IMyEventRoot.interface';
import { EmailService } from 'src/app/Mail/email.service';
import { IMessageData } from 'src/app/IMessageData.interface';



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsForm: FormGroup;
  message: IMessageData;

  constructor(
    private mailService: EmailService,
    private formBuilder: FormBuilder,
    private eventService: EventService
  ) {}


    /**
     * Listens for messages sent from the event service
     */
  listenForMessages() {
     this.eventService.getMessageListener().subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
      }, messageData.fadingTime);
      setTimeout(() => {
        window.location.reload();
      }, messageData.fadingTime);
    });
  }
  ngOnInit() {
    this.newsForm = this.formBuilder.group({
      textCtrl: ['', [Validators.required, Validators.minLength(15)]],
      subjectCtrl: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    });
    this.listenForMessages();
  }

  onSend(textInput: HTMLInputElement, subjectInput: HTMLInputElement) {
    if (this.newsForm.invalid) {
      return;
    }
    textInput.value =
    textInput.value +
     '\n\n\n\n\n\n\n' +
     'For at afmelde nyhedbrevet tryk her:'
     + 'http://localhost:4200/unsubscribeNews';

    this.mailService.sendNewsMailToAll(subjectInput.value, textInput.value);
    textInput.value = '';
    subjectInput.value = '';
  }
}
