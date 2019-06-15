import {
  Component,
  OnInit,
  Output,
  ViewChild,
  Input,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  EventService } from '../event.service';
import { OwlDateTime } from 'ng-pick-datetime/date-time/date-time.class';
import { IEvent } from '../IEvent.interface';
import { extractEventFromRoot } from 'src/app/helper/extractEventFromRoot';
import { IMyEventRoot } from '../IMyEventRoot.interface';
import { mimeType } from '../mime-type.validator';

export interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  categories: Category[] = [
    { value: 'Fest', viewValue: 'Fest' },
    { value: 'Forsamling', viewValue: 'Forsamling' },
    { value: 'Biograf', viewValue: 'Biograf' },
    { value: 'Koncert', viewValue: 'Koncert' },
    { value: 'Tale', viewValue: 'Tale' },
    { value: 'Leg', viewValue: 'Leg' }
  ];

  eventForm: FormGroup;
  @ViewChild('startTime') startTime: OwlDateTime<Date>;
  @ViewChild('endTime') endTime: OwlDateTime<Date>;
  @Input() mode: string;
  @Output() statusEmitter: EventEmitter<boolean> = new EventEmitter();
  imagePreview: string;
  minDate = new Date();
  maxDate = new Date();
  imagePath: any;

  constructor(private builder: FormBuilder, private eventService: EventService) {}
  ngOnInit() {
    this.initEventForm();
    this.actOnMode(this.mode);
    this.validateMaxEndDate();
    this.emitOnStatusChanged();
  }

  /**
   * Act on either edit or create mode and initializes the needed listeners for that specific mode
   * @param mode the current mode/state of the website
   */
actOnMode(mode: string) {
  if (mode === 'edit') {
    this.eventService.getEditEventListener().subscribe(eventRoot => {
      this.setEventForm(extractEventFromRoot(eventRoot));
    });

    this.eventForm.valueChanges.subscribe(() => {
      this.setNewValues(this.eventService.currentRootEvent, this.getEventFromForm());
    });
  }

  if (mode === 'create') {
    if (this.eventService.currentEvent) {
      this.setEventForm(this.eventService.currentEvent);
    }
    this.eventForm.valueChanges.subscribe(() => {

      this.eventService.currentEvent = this.getEventFromForm();
    });
  }

}

/**
 * Changes and previews the image in the form evertytime a new image is picked from the filepicker
 * @param event the event of the filpicker
 */
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.eventForm.get('imageForm').patchValue({ imagePathCtrl: file });
    this.eventForm
      .get('imageForm')
      .get('imagePathCtrl')
      .updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Initializes the event form
   */
  initEventForm() {
    this.eventForm = this.builder.group({
      themeForm: this.builder.group({
        themeCtrl: [null, Validators.required]
      }),
      nameForm: this.builder.group({
        nameCtrl: [null, [Validators.required, Validators.maxLength(30)]]
      }),
      descForm: this.builder.group({
        descCtrl: [null, [Validators.required, Validators.maxLength(2000)]]
      }),
      ageLimitForm: this.builder.group({
        ageLimitCtrl: [null, [Validators.required, Validators.max(120)]]
      }),
      startTimeForm: this.builder.group({
        startTimeCtrl: ['', Validators.required]
      }),
      endTimeForm: this.builder.group({
        endTimeCtrl: ['', Validators.required]
      }),
      imageForm: this.builder.group({
        imagePathCtrl: ['', Validators.compose([Validators.required]), mimeType]
      }),
      costForm: this.builder.group({
        costCtrl: [null, [Validators.required, Validators.max(30000)]]
      })
    });
  }

get controls(){
 return this.eventForm.controls;
}

/**
 * Takes the current event details and sets the values to the rootevent event details
 * @param rootEvent the current eventRoot
 * @param event the current event details
 */
  setNewValues(rootEvent: IMyEventRoot, event: IEvent) {
    rootEvent.name = event.name;
    rootEvent.cost = event.cost;
    rootEvent.description = event.description;
    rootEvent.ageLimit = event.ageLimit;
    rootEvent.theme = event.theme;
    rootEvent.imagePath = event.imagePath;
    rootEvent.startTime = event.startTime;
    rootEvent.endTime = event.endTime;
  }
  /**
   * Sets the form to the cureent event details
   * @param event the event details which is going to be set to the event form
   */
  setEventForm(event: IEvent) {

      this.eventForm.get('endTimeForm').setValue({
        endTimeCtrl: new Date()
      });

      this.eventForm.get('themeForm').setValue({
      themeCtrl: event.theme
    });
      this.eventForm.get('nameForm').setValue({
      nameCtrl: event.name
    });
      this.eventForm.get('descForm').setValue({
      descCtrl: event.description
    });
      this.eventForm.get('ageLimitForm').setValue({
      ageLimitCtrl: event.ageLimit
    });
      this.eventForm.get('imageForm').setValue({
      imagePathCtrl: event.imagePath
    });
      this.eventForm.get('costForm').setValue({
      costCtrl: event.cost
    });
      this.eventForm.get('startTimeForm').setValue({
      startTimeCtrl: new Date(event.startTime)
    });

      this.eventForm.get('endTimeForm').setValue({
      endTimeCtrl: new Date(event.endTime)
    });
      this.imagePreview = this.eventForm.get('imageForm').value.imagePathCtrl;

  }

  ngOnDestroy() {

  }

  /**
   * get the control from the eventform
   */
  get fControls() {
    return this.eventForm.controls;
  }
  validateMaxEndDate() {
    this.eventForm.get('startTimeForm').valueChanges.subscribe(date => {
      this.maxDate = date.startTimeCtrl;
    });
  }
  /**
   * Gets the event details form the event form
   * @ returns IEvent
   */
   getEventFromForm() {
  const event: IEvent = {
    ageLimit: this.fControls.ageLimitForm.get('ageLimitCtrl').value,
    cost: this.fControls.costForm.get('costCtrl').value,
    description: this.fControls.descForm.get('descCtrl').value,
    endTime: this.fControls.endTimeForm.get('endTimeCtrl').value,
    startTime: this.fControls.startTimeForm.get('startTimeCtrl').value,
    imagePath: this.fControls.imageForm.get('imagePathCtrl').value,
    theme: this.fControls.themeForm.get('themeCtrl').value,
    name: this.fControls.nameForm.get('nameCtrl').value
  };
  return event;
  }

  /**
   * Emits the eventform status everytime the statis of the event form changes
   */
  emitOnStatusChanged() {
    this.eventForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.statusEmitter.emit(true);
      } else {
        this.statusEmitter.emit(false);
      }
    });
  }
}
