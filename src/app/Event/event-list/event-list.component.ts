import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { EventService } from '../event.service';
import { IMyEventRoot } from '../IMyEventRoot.interface';
import { AuthenticateService } from 'src/app/Auth/Authenticate.service';
import { Subscription } from 'rxjs';
import { PageEvent, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EventDialogComponent } from 'src/app/dialogs/event-dialog/event-dialog.component';
import { EmailDialogComponent } from 'src/app/dialogs/email-dialog/email-dialog.component';
import { IMessageData } from 'src/app/IMessageData.interface';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  public currentCardId = 0;
  public isCollapsed = false;
  public events = [];
  public isLoading = false;
  private authStatusSubs: Subscription;
  public  userId: string;
  public isUserAuthenticated = false;
  public message: IMessageData;
  public startAmount = 0;
  public endAmount = 5;

  constructor(
    private eventService: EventService,
    private authService: AuthenticateService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.getEventsOnRouteChanged(this.startAmount, this.endAmount);
    this.listenForMessages();
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

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
      }, messageData.fadingTime);
    });
  }

  /**
   * deletes an event when button is clicked
   * @param eventId the id of the clicked event
   */
  onDelete(eventId: string) {
    this.eventService.deleteEvent(eventId);
    this.getEvents(this.startAmount, this.endAmount);
  }

/**
 * Gets the events related to the current route
 * @param startAmount the start amount of events to be display
 * @param endAmount the end amount of events to be displayed
 */
  getEventsOnRouteChanged(startAmount, endAmount) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('isRequstedEvents')) {
        this.getRequstedEvents(startAmount, endAmount);
      } else if (this.router.url === '/events/user') {
        this.getUserEvents(startAmount, endAmount);
      } else {
        this.getEvents(startAmount, endAmount);
      }
    });
  }

  /**
   * Gets the events
   * @param startAmount the start amount of events to be displayed
   * @param endAmount the end amount of events to be displayed
   */
  getEvents(startAmount, endAmount) {
    this.eventService.getLimitedAmountOfEvents(startAmount, endAmount);
    this.eventService
      .eventsUpdatedSubjectListener()
      .subscribe(eventData => {
        this.isLoading = true;
        this.events = eventData.events.map(eventRoot => {
          return {
            event: eventRoot,
            formattedStartTime: formatDate(eventRoot.startTime),
            formattedEndTime: formatDate(eventRoot.endTime)
          };
        });

        this.isLoading = false;
      });
  }
  /**
   * gets the requested events
   * @param startAmount the start amount of events to be displayed
   * @param endAmount the end amount of events to be displayed
   */
  getRequstedEvents(startAmount, endAmount) {
    this.eventService.getRequestedEvents(startAmount, endAmount);
    this.eventService
      .eventsUpdatedSubjectListener()
      .subscribe(eventData => {
        this.isLoading = true;
        this.events = eventData.events.map(eventRoot => {
          return {
            event: eventRoot,
            formattedStartTime: formatDate(eventRoot.startTime),
            formattedEndTime: formatDate(eventRoot.endTime)
          };
        });

        this.isLoading = false;
      });
  }
/**
 * Gets the user events
 * @param startAmount the start amount of events to be displayed
 * @param endAmount the end amount of events to be displayed
 */
  getUserEvents(startAmount, endAmount) {
    this.eventService.getUserEvents(startAmount, endAmount);
    this.eventService
      .eventsUpdatedSubjectListener()
      .subscribe(eventData => {
        this.isLoading = true;
        this.events = eventData.events.map(eventRoot => {
          return {
            event: eventRoot,
            formattedStartTime: formatDate(eventRoot.startTime),
            formattedEndTime: formatDate(eventRoot.endTime)
          };
        });
        this.isLoading = false;
      });
  }

  /**
   * Collapses the event when clickec
   * @param matCard current mat card
   */
  OnCollapse(matCard: { id: number }) {
    this.currentCardId = matCard.id;
    if (this.isCollapsed === true) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }
/**
 * Declines the event when clicked on button
 * @param event event to be declined
 */
  onDecline(event: any) {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      data: event
    });

    dialogRef.afterClosed().subscribe(res => console.log(res));
    this.getEventsOnRouteChanged(this.startAmount, this.endAmount);
  }

  /**
   * Publishes the event when clicked on publish button
   * @param eventRoot the event to be published
   */
  onPublish(eventRoot: IMyEventRoot) {
    const eventToPublish = eventRoot;
    eventToPublish.creator = this.userId;
    this.eventService.publishEvent(eventToPublish);
    this.eventService.declineRequstedEvent(eventRoot);
    this.eventService.sendPublishedMail(
      eventRoot.name,
      eventRoot.contactPerson.contactName,
      eventRoot.contactPerson.contactEmail
    );
  }

  /**
   * Opens the mat dialog ehich shows the event detials
   * @param eventRoot the event to be displayed
   */
  onReadMore(eventRoot: IMyEventRoot) {
    const displayEvent = {
      id: eventRoot._id,
      startTime: formatDate(eventRoot.startTime),
      cost: eventRoot.cost,
      line: eventRoot.address.line,
      endTime: formatDate(eventRoot.endTime),
      city: eventRoot.address.city,
      ageLimit: eventRoot.ageLimit,
      imagePath: eventRoot.imagePath,
      name: eventRoot.name,
      zipCode: eventRoot.address.zipCode
    };
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: displayEvent
    });

    dialogRef.afterClosed().subscribe();
  }
/**
 * retrives 5 more events to be displayed
 */
  showMoreEvents() {
    this.endAmount = this.endAmount + 5;
    this.getEventsOnRouteChanged(this.startAmount, this.endAmount);
  }
}

function getMinutesFromDate(number: number) {
  if (number < 10) {
    return number + '0';
  }
  return number;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return (
    date.toDateString() +
    ' ' +
    date.getHours() +
    ':' +
    getMinutesFromDate(date.getMinutes())
  );
}
