import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material';
import { EventService } from '../../Event/event.service';
import { IMyEventRoot } from '../../Event/IMyEventRoot.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {
  reasonForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: EventService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.reasonForm = this.formBuilder.group({
      reasonCtrl: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSend(eventRoot: IMyEventRoot, reasonForDecline: MatInput) {

    this.dataService.sendDeclinedMail(
      eventRoot.name,
      eventRoot.contactPerson.contactName,
      eventRoot.contactPerson.contactEmail,
      reasonForDecline.value
    );
    this.dialogRef.close();
    this.dataService.declineRequstedEvent(eventRoot);
  }
}
