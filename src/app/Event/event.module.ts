import { NgModule } from '@angular/core';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { ContactPersonFormComponent } from './contact-person-form/contact-person-form.component';
import { EventDialogComponent } from '../dialogs/event-dialog/event-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {
  NgbModule,
  NgbTimepickerModule,
  NgbAlertModule,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CreateEventComponent,
    EventListComponent,
    EventFormComponent,
    AddressFormComponent,
    ContactPersonFormComponent,
    EventDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    NgbTimepickerModule,
    NgbAlertModule,
    NgbDropdownModule
  ]
})
export class EventModule {}
