import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IMyEventRoot } from '../../Event/IMyEventRoot.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../../Event/event.service';
import { IMessageData } from 'src/app/IMessageData.interface';


export interface IEventDialogData {

    id: string;
    startTime: string;
    cost: string;
    line: string;
    endTime: string;
    city: string;
    ageLimit: string;
    imagePath: string;
    name: string;
    zipCode: string;
}
@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent implements OnInit {
attendForm: FormGroup;
isAttendMode = false;
message: IMessageData;
  constructor(public dialogRef: MatDialogRef<EventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IEventDialogData,
              private formBuilder: FormBuilder, private eventService: EventService) { }

event: IMyEventRoot;

  ngOnInit() {
    this.attendForm = this.formBuilder.group({
      emailCtrl: [null, [Validators.required, Validators.email]]
    });
    this.listenForMessages();
  }

  onClose() {
    this.dialogRef.close();
  }

  onAttend() {
    this.isAttendMode = true;
  }
  onSendingMail(emailInput: HTMLInputElement) {
    this.isAttendMode = false;
    if (this.attendForm.invalid) {
      return;
    }
    this.eventService.addAttendee(emailInput.value, this.data.id);
    console.log(this.data);
  }

  listenForMessages() {
     this.eventService.getMessageListener().subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
      }, messageData.fadingTime);
      setTimeout(() => {
      }, messageData.fadingTime);
    });
  }
}
