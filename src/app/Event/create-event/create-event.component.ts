import { Component, OnInit, OnDestroy } from "@angular/core";
import { EventService } from "../event.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Subscription } from "rxjs";
import { __await } from "tslib";
import { isUndefined } from "util";
import { extractEventFromRoot } from "src/app/helper/extractEventFromRoot";
import { MatButton } from "@angular/material";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class CreateEventComponent implements OnInit, OnDestroy {
  mode = "create";
  private eventId: string;
  minDate = new Date();
  selectedTab: number;
  message: { message: string; isErrorMessage: boolean; fadingTime: number };
  messageSubs: Subscription;
  isContactFormValid: boolean;
  isAddressFormValid: boolean;
  isEventFormValid: boolean;
  isLoading: boolean;
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEvent(this.eventId);
    this.messageSubs = this.listenForMessages();
  }

  /**
   * Listens for messages sent from the event service
   */
  listenForMessages() {
    return this.eventService.getMessageListener().subscribe(messageData => {
      this.message = messageData;
      setTimeout(() => {
        this.message = undefined;
        this.eventService.currentAddress = undefined; 
        this.eventService.currentRootEvent = undefined; 
        this.eventService.currentContactPerson = undefined; 
        this.eventService.currentEvent = undefined; 
        this.router.navigate(['/allEvents']);
      }, messageData.fadingTime);
    });
  }
  /**
   * Gets the event to be created or updated
   * @param eventId the id of the event to create or update
   */
  getEvent(eventId: string) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("eventId")) {
        this.mode = "edit";
        eventId = paramMap.get("eventId");
        this.eventId = eventId;
        this.eventService.getOneEvent(eventId);
        this.createdUpdatedEvent();
      } else {
        this.mode = "create";
        eventId = null;
      }
    });
  }
  /**
   * Saves the event when save button is clicked
   */
  saveEvent() {
    if (this.mode === "create") {
      this.isLoading = true;
      this.eventService.postEvent(
        this.eventService.currentEvent,
        this.eventService.currentAddress,
        this.eventService.currentContactPerson
      );
      this.isLoading = false;
    } else {
      this.isLoading = true;
      this.eventService.updateEvent(
        this.eventId,
        extractEventFromRoot(this.eventService.currentRootEvent),
        this.eventService.currentRootEvent.address,
        this.eventService.currentRootEvent.contactPerson
      );
      this.isLoading = false;
    }
  }
  /**
   * gets the emitted address form status
   * @param isValid the status of the form
   */
  getAddressFormStatus(isValid: any) {
    if (!isUndefined(isValid)) {
      this.isAddressFormValid = isValid;
    }
  }
  /**
   * gets the emitted event form status
   * @param isValid the status of the form
   */
  getEventFormStatus(isValid: any) {
    if (!isUndefined(isValid)) {
      this.isEventFormValid = isValid;
    }
  }
  /**
   * gets the emitted contactperson form status
   * @param isValid the status of the form
   */
  getContactFormStatus(isValid: any) {
    if (!isUndefined(isValid)) {
      this.isContactFormValid = isValid;
    }
  }
  /**
   * created the event which is going to be updated
   */
  createdUpdatedEvent() {
    setTimeout(() => {
      this.selectedTab = 1;
    }, 100);

    setTimeout(() => {
      this.selectedTab = 2;
    }, 100);
  }
  ngOnDestroy(): void {
    this.messageSubs.unsubscribe();
  }
}
