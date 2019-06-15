import { IAddress } from './IAddress.interface';
import { IContactPerson } from './IContactPerson.interface';
import { IEvent } from './IEvent.interface';

export interface IMyEventRoot {
   _id: string;
   name: string;
   description: string;
   cost: number;
   ageLimit: number;
   imagePath: File | string;
   endTime: any;
   startTime: any;
   theme: string;
    creator: string;
    address: {
        city: string,
        zipCode: number,
        line: string
    };
    contactPerson: {
        contactName: string,
        contactPhone: string,
        contactEmail: string
    };
    __v: number;
}
