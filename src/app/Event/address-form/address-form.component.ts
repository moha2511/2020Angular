import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  EventService } from '../event.service';
import { Subscription } from 'rxjs';
import { IAddress } from '../IAddress.interface';
import { isUndefined } from 'util';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})

export class AddressFormComponent implements OnInit, OnDestroy {

  addressForm: FormGroup;
  @Input() mode;
  @Output() statusEmitter: EventEmitter<boolean> = new EventEmitter();
  editEventSubsription: Subscription;

  constructor(private builder: FormBuilder,
              private eventService: EventService) { }

  ngOnInit() {
    this.initAddressForm();
    this.actOnMode(this.mode);
    this.emitOnStatusChanged();

  }

/**
 * Act on either edit or create mode and initializes the needed observables for that specific mode
 * @param mode the current state of the parent component
 */
  actOnMode(mode: string) {
    if (mode === 'edit') {

      this.editEventSubsription = this.eventService.getEditEventListener().subscribe(event => {
          this.setAdrressForm(event.address);
        });

      this.addressForm.valueChanges.subscribe(() => {
          this.eventService.currentRootEvent.address = this.getAddressFromForm();
        });

      } else if  (mode === 'create') {
        if (this.eventService.currentAddress) {
          this.setAdrressForm(this.eventService.currentAddress);
        }
        this.addressForm.valueChanges.subscribe(() => {
          this.eventService.currentAddress = this.getAddressFromForm();
        });
      }
  }
  /**
   * Initializes the address form
   */
  initAddressForm() {

    this.addressForm = this.builder.group({

      cityForm:  this.builder.group({
        cityCtrl: [null, [Validators.required, Validators.maxLength(60)]]
      }),

      lineForm:  this.builder.group({
        lineCtrl: [null, [Validators.required, Validators.maxLength(60)]]
      }),
      zipCodeForm: this.builder.group({
        zipCodeCtrl: [null, [Validators.required, Validators.max(9999)]]
      })
    });

  }
/**
 * Sets the address form
 * @param address The addrss details which will be set to the form
 */
  setAdrressForm(address: IAddress) {
    this.addressForm.get('cityForm').setValue({
      cityCtrl: address.city
    });

    this.addressForm.get('lineForm').setValue({
      lineCtrl: address.line
    });

    this.addressForm.get('zipCodeForm').setValue({
      zipCodeCtrl: address.zipCode
    });

  }

  ngOnDestroy() {

    if (!isUndefined(this.editEventSubsription)) {
    this.editEventSubsription.unsubscribe();
    }
  }
/**
 * Gets the address details from the form
 * @returns IAdress
 */
  getAddressFromForm() {
    const address: IAddress = {
       city: this.addressForm.get('cityForm').value.cityCtrl,
       zipCode: this.addressForm.get('zipCodeForm').value.zipCodeCtrl,
       line: this.addressForm.get('lineForm').value.lineCtrl
    };
    return address;
  }
/**
 * Emits the current status of the form everytime the status changes
 */
  emitOnStatusChanged() {
    this.addressForm.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.statusEmitter.emit(true);
      } else {
        this.statusEmitter.emit(false);
      }
    });
  }
}
