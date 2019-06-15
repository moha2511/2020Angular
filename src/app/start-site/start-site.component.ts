import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../Mail/email.service';
import { IMessageData } from '../IMessageData.interface';
import { EventService } from '../Event/event.service';

@Component({
  selector: 'app-start-site',
  templateUrl: './start-site.component.html',
  styleUrls: ['./start-site.component.css']
})
export class StartSiteComponent implements OnInit {
emailFormGroup: FormGroup;
isSubmitted = false;
message: IMessageData;
  constructor(private formBuilder: FormBuilder,
              private emailService: EmailService,
              private eventService: EventService) { }

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
  onReadMore(sectionTwo: HTMLElement) {
   sectionTwo.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
}

onSendNewsMail(emailInput: HTMLInputElement) {
    this.isSubmitted = true;
    this.emailService.addNewsMail(emailInput.value);
}
}
