import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, ReplaySubject } from 'rxjs';
import { IMyEventRoot } from './IMyEventRoot.interface';
import { Router } from '@angular/router';
import { IEvent } from './IEvent.interface';
import { IContactPerson } from './IContactPerson.interface';
import { IAddress } from './IAddress.interface';
import { AuthenticateService } from '../Auth/Authenticate.service';
import { IMessageData } from '../IMessageData.interface';
import { EmailService } from '../Mail/email.service';
/**
 * Service for CRUD actions in related to events
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private editEventSubject = new ReplaySubject<IMyEventRoot>();
  private eventsUpdatedSubject = new Subject<{events: IMyEventRoot[]; totalEvents: number; }>();
  private events: IMyEventRoot[];
  private messageSubject = new Subject<IMessageData>();
  currentRootEvent: IMyEventRoot;
  currentContactPerson: IContactPerson;
  currentEvent: IEvent;
  currentAddress: IAddress;
  maxEvents: number;
  totalEvents: number;
  private BACKEDEND_URL = 'https://newmousleheventappp.herokuapp.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticateService,
    private emailService: EmailService
  ) {}

  /**
   * @returns an observable of the messageSubejct
   */
  getMessageListener() {
    return this.messageSubject.asObservable();
  }

  /**
   * @returns an observable of the editEventSubejct
   */
  getEditEventListener() {
    return this.editEventSubject.asObservable();
  }
  /**
   * @returns an observable of the updateEventSubejct Subejct
   */
  eventsUpdatedSubjectListener() {
    return this.eventsUpdatedSubject.asObservable();
  }

  /**
   * fetching a limited amount of events based on a start end end index on the given array in the api
   * end emits an message to every listener
   * @param startAmount number defining the start amount of events which are going to fetched
   * @param endAmount number defining the end amount of events which are going to fetched
   */
  getLimitedAmountOfEvents(startAmount: number, endAmount: number) {
    const queryParams = `?startAmount=${startAmount}&endAmount=${endAmount}`;

    this.http
      .get<{ message: string; events: IMyEventRoot[]; maxEvents: number }>(
        this.BACKEDEND_URL +'/event' + queryParams
      )
      .subscribe(eventData => {
        this.events = eventData.events;
        this.eventsUpdatedSubject.next({
          events: [...this.events],
          totalEvents: this.events.length
        });
      }, error => console.log(error));
  }

  /**
   * fetching a limited amount of requested events based on a start and end index on the given array in the api
   * and emits an message to every listener
   * @param startAmount number defining the start amount of events which are going to fetched
   * @param endAmount number defining the end amount of events which are going to fetched
   */
  getRequestedEvents(startAmount: number, endAmount: number) {
    const queryParams = `?startAmount=${startAmount}&endAmount=${endAmount}`;
    this.http
      .get<{ message: string; events: IMyEventRoot[]; maxEvents: number }>(
        this.BACKEDEND_URL+'/requestedEvents' + queryParams
      )
      .subscribe(eventData => {
        this.events = eventData.events;
        this.eventsUpdatedSubject.next({
          events: [...this.events],
          totalEvents: this.events.length
        });
      });
  }

  /**
   * declines a requested event based on its data and emits an message to every listener
   * @param eventRoot is the event which will be declined
   */
  declineRequstedEvent(eventRoot: IMyEventRoot) {
    this.http
      .delete(this.BACKEDEND_URL+'/requestedEvents/' + eventRoot)
      .subscribe(() => {
        this.eventsUpdatedSubject.next({
          events: [...this.events],
          totalEvents: this.events.length
        });
      });
  }

  /**
   * posts an event based on 3 different interfaces and emits a message to every listener
   * @param event specifies the eventDetails which are going to be posted
   * @param address specifies the addressDetails which are going to be posted
   * @param contactPerson specifies the contactPersonDetails which are going to be posted
   */
  postEvent(event: IEvent, address: IAddress, contactPerson: IContactPerson) {
    this.http
      .post<{ message: string }>(
        this.BACKEDEND_URL+'/event',
        this.createEventFormData(event, address, contactPerson)
      )
      .subscribe(
        res => {
          this.messageSubject.next({
            message: res.message,
            isErrorMessage: false,
            fadingTime: 6000
          });
          this.emailService.sendNewsAboutNewEvent(event, address);
        },
        error => {
          this.messageSubject.next({
            message: error.error.message,
            isErrorMessage: true,
            fadingTime: 6000
          });
        }
      );
  }

  /**
   *  fetching a limited amount of user events based on a user id and start end end index on the given array in the api
   *  emits an message to every listener
   * @param startAmount startAmount number defining the start amount of events which are going to fetched
   * @param endAmount  endAmount number defining the end amount of events which are going to fetched
   */
  getUserEvents(startAmount: number, endAmount: number) {
    const queryParams = `?startAmount=${startAmount}&endAmount=${endAmount}`;
    this.http
      .get<{ message: string; events: IMyEventRoot[]; maxEvents: number }>(
        this.BACKEDEND_URL+'/event/user/events/' + this.authService.getUserId() + queryParams
      )
      .subscribe(eventData => {
        this.events = eventData.events;
        this.eventsUpdatedSubject.next({
          events: [...this.events],
          totalEvents: this.events.length
        });
      });
  }

  /**
   * Changes the state of a requsted event to a normal published event
   * emits a message to every listener
   * @param event the event which is going to be published
   */
  publishEvent(event: IMyEventRoot) {
    this.http
      .post<{ message: string }>(this.BACKEDEND_URL+'/event/publish', event)
      .subscribe(
        res => {
          this.messageSubject.next({
            message: res.message,
            isErrorMessage: false,
            fadingTime: 1000
          });

          this.emailService.sendNewsMailToAll('NYT ARRANGEMENT 🎉🎉',
          'Der er blevet oprttet et nyt arrangement på vores side \n'
          + 'Navn :' + event.name
          + 'Adresse : ' + event.address.line
          + 'Pris : ' + event.cost);

        },
        error => {
          this.messageSubject.next({
            message: 'Noget gik galt prøv at trykke F5 eller opdater siden',
            isErrorMessage: true,
            fadingTime: 1000
          });
        }
      );
  }

  /**
   * Deletes an event
   * @param id the id of the event which is going to be deleted
   */
  deleteEvent(id: string) {
     this.http
      .delete<{ message: string }>(this.BACKEDEND_URL+'/event/' + id)
      .subscribe(res => {
          const filteredList: IMyEventRoot[] = this.events.filter(event => event._id !== id);
          this.eventsUpdatedSubject.next({events: filteredList, totalEvents: filteredList.length});
          this.messageSubject.next({
            message: res.message,
            isErrorMessage: true,
            fadingTime: 3000
          });
        },
        error => {
          this.messageSubject.next({
            message: error.error.message,
            isErrorMessage: false,
            fadingTime: 3000
          });
        }
      );
  }

  /**
   * Updates an event
   * Emits a message to every listener
   * @param id the id of the event which is going to be deleted
   * @param event the new eventdetails
   * @param address the new addressDetails
   * @param contactPerson the new contactPersonDetails
   */
  updateEvent(
    id: string,
    event: IEvent,
    address: IAddress,
    contactPerson: IContactPerson
  ) {
    this.http
      .put<{ message: string }>(
        this.BACKEDEND_URL+'/event/' + id,
        this.createEventFormData(event, address, contactPerson)
      )
      .subscribe(
        res => {

          this.messageSubject.next({
            message: res.message,
            isErrorMessage: false,
            fadingTime: 3000
          });
          this.emailService.sendNewsMailOnEventupdate(id);
        },
        error => {
          this.messageSubject.next({
            message: error.error.message,
            isErrorMessage: true,
            fadingTime: 3000
          });
        }
      );
  }

  /**
   * Retrives one event
   * Emits the event to every listener
   * @param id the id of the event
   */
  getOneEvent(id: string) {
    this.http
      .get<IMyEventRoot>(this.BACKEDEND_URL+'/event/' + id)
      .subscribe(event => {
        this.currentRootEvent = event;
        this.editEventSubject.next(event);
      });
  }

  /**
   * Creates the needed formData for an event to either be created or updated
   * It check for state of the current event, address, and contactPerson details
   * If the image in the eventDetails is an object it make sure to the new file
   * If the image is a string then the image state is not changed and is still path and therefor no new file needs to be uploaded
   * @param event the new eventDetails
   * @param address the new AddressDetails
   * @param contactPerson the new ContactPerson details
   */
  private createEventFormData(
    event: IEvent,
    address: IAddress,
    contactPerson: IContactPerson
  ) {
    if ((event || address || contactPerson) === undefined) {
      return;
    }
    if (typeof event.imagePath === 'object') {
      const fd = new FormData();
      fd.append('name', event.name);

      fd.append('description', event.description);

      fd.append('theme', event.theme);

      fd.append('ageLimit', event.ageLimit.toString());

      fd.append('startTime', event.startTime);

      fd.append('endTime', event.endTime);

      fd.append('cost', event.cost.toString());

      fd.append('imagePath', event.imagePath, event.imagePath.name);

      fd.append('line', address.line);

      fd.append('zipCode', address.zipCode.toString());

      fd.append('city', address.city);

      fd.append('contactName', contactPerson.contactName);

      fd.append('contactPhone', contactPerson.contactPhone);

      fd.append('contactEmail', contactPerson.contactEmail);

      fd.append('creatorId', this.authService.getUserId());
      return fd;
    } else {
      const fd = new FormData();

      fd.append('name', event.name);

      fd.append('description', event.description);

      fd.append('theme', event.theme);

      fd.append('ageLimit', event.ageLimit.toString());

      fd.append('startTime', event.startTime);

      fd.append('endTime', event.endTime);

      fd.append('cost', event.cost.toString());

      fd.append('imagePath', event.imagePath);

      fd.append('line', address.line);

      fd.append('zipCode', address.zipCode.toString());

      fd.append('city', address.city);

      fd.append('contactName', contactPerson.contactName);

      fd.append('contactPhone', contactPerson.contactPhone);

      fd.append('contactEmail', contactPerson.contactEmail);

      fd.append('creatorId', this.authService.getUserId());
      return fd;
    }
  }

  /**
   * Sends a mail to a creator of an event if the event is declined
   * @param eventName The name of the event
   * @param personName The name of the person
   * @param email The email of the person
   * @param reason The reason for the email to be declined
   */
  sendDeclinedMail(eventName, personName, email, reason) {
    const declinedMailObject = {
      eventName,
      personName,
      email,
      reason
    };

    this.http
      .post(this.BACKEDEND_URL+'/user/declinedMail/', declinedMailObject)
      .subscribe(res => console.log(res));
  }

  /**
   * Send a mail to creator of an event if the event is successfully published
   * @param eventName The name of the event
   * @param personName The name of the creator
   * @param email The email of the creator of the event
   */
  sendPublishedMail(eventName, personName, email) {
    const declinedMailObject = {
      eventName,
      personName,
      email
    };

    this.http
      .post(this.BACKEDEND_URL+'/user/publishedMail/', declinedMailObject)
      .subscribe(res => console.log(res));
  }

  /**
   * Adds an attendee to the event
   * @param email the attendees email
   * @param eventId the event id
   */
  addAttendee(email: string, eventId) {
    const attendee = {
      id: eventId,
      email
    };
    this.http.post<{message: string}>(this.BACKEDEND_URL+'/event/addAttendee', attendee)
    .subscribe(response => {
      this.messageSubject.next({
        message: response.message,
        isErrorMessage: false,
        fadingTime: 3000
      });
    }, error => {
        this.messageSubject.next({
          message: error.error.message,
          isErrorMessage: true,
          fadingTime: 3000
        });
    });
  }
  getRequstedThemeEvents(
    theme: string,
    eventsPerPage: number,
    currentPage: number
  ) {
    const queryParams = `?pageSize=${eventsPerPage}&page=${currentPage}&theme=${theme}`;
    this.http
      .get<{ message: string; events: IMyEventRoot[]; maxEvents: number }>(
        this.BACKEDEND_URL+'/event/theme' + queryParams
      )
      .subscribe(eventData => {
        eventData.events.filter(
          eventRoot => new Date(eventRoot.endTime) > new Date()
        );
        this.events = eventData.events;
        this.eventsUpdatedSubject.next({
          events: [...this.events],
          totalEvents: this.events.length
        });
      });
  }
}
