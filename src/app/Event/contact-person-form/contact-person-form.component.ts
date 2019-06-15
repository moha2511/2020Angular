import { Component, OnInit, Output, Input, OnDestroy, EventEmitter} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventService } from '../event.service';
import { IContactPerson } from '../IContactPerson.interface';
import { Subscription } from 'rxjs/internal/Subscription';
import { isUndefined } from 'util';


@Component({
  selector: 'app-contact-person-form',
  templateUrl: './contact-person-form.component.html',
  styleUrls: ['./contact-person-form.component.css']
})
export class ContactPersonFormComponent implements OnInit, OnDestroy {

  contactForm: FormGroup;
  @Input() mode: string;
  @Output() statusEmitter = new EventEmitter<boolean>();
  isFormValid = false;
  editEventSubstription: Subscription;

  constructor(private builder: FormBuilder,
              private eventService: EventService,
  ) { }

  ngOnInit() {

    this.initContactForm();
    this.actOnMode(this.mode);
    this.emitOnStatusChanged();

  }
/**
 * Initializes the contact person form
 */
  initContactForm() {
    this.contactForm = this.builder.group({
      nameForm: this.builder.group({
        contactNameCtrl: [null, [Validators.required, Validators.maxLength(50)]]
      }),
      phoneForm: this.builder.group({
        contactPhoneCtrl: [null, [Validators.required, Validators.max(99999999), Validators.max(11111111)]]
      }),
      emailForm: this.builder.group({
          contactEmailCtrl: [null, [Validators.required, Validators.email, Validators.maxLength(100)]]
        })
    });
  }
/**
 *  Act on either edit or create mode and initializes the needed listeners for that specific mode
 * @param mode the current state of the website
 */
  actOnMode(mode: string) {
    if (mode === 'edit') {
     this.editEventSubstription = this.eventService.getEditEventListener().subscribe(event => {
        this.setContactForm(event.contactPerson);
      });

     this.contactForm.valueChanges.subscribe(() => {
        this.eventService.currentRootEvent.contactPerson = this.getContactPersonFromForm();
      });
    }
    if (mode === 'create') {
      if (this.eventService.currentContactPerson) {
        this.setContactForm(this.eventService.currentContactPerson);
      }
      this.contactForm.valueChanges.subscribe(() => {

        this.eventService.currentContactPerson = this.getContactPersonFromForm();
      });

    }
  }
  /**
   * Sets the contact person form
   * @param contactPerson the contactperson details which is going to be set to the form
   */
  setContactForm(contactPerson: IContactPerson) {

    this.contactForm.get('emailForm').setValue({
      contactEmailCtrl: contactPerson.contactEmail
    });

    this.contactForm.get('nameForm').setValue({
      contactNameCtrl: contactPerson.contactName
    });

    this.contactForm.get('phoneForm').setValue({
      contactPhoneCtrl: contactPerson.contactPhone
    });
  }
/**
 * Gets the contactperson details from the form
 * @returns IContactPerson
 */
  getContactPersonFromForm() {
    const person: IContactPerson = {
       contactEmail: this.contactForm.get('emailForm').value.contactEmailCtrl,
       contactName: this.contactForm.get('nameForm').value.contactNameCtrl,
       contactPhone: this.contactForm.get('phoneForm').value.contactPhoneCtrl
    };
    return person;
  }
/**
 *  Emits the status of the contact person form everytime the status changes
 */
  emitOnStatusChanged() {

    this.contactForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.statusEmitter.emit(true);
      } else {
        this.statusEmitter.emit(false);
      }
    });
  }

  ngOnDestroy() {
    if (!isUndefined(this.editEventSubstription)) {
    this.editEventSubstription.unsubscribe();
    }
    }
  }


