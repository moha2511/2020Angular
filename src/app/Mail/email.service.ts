import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { IMessageData } from '../IMessageData.interface';
import { IMyEventRoot } from '../Event/IMyEventRoot.interface';
import { IEvent } from '../Event/IEvent.interface';
import { IAddress } from '../Event/IAddress.interface';


@Injectable({
    providedIn: 'root'
  })
  export class EmailService {
    private messageSubject = new Subject<IMessageData>();
    private BACKEDEND_URL = 'https://newmousleheventappp.herokuapp.com';


    constructor(private http: HttpClient) {}

    getMessageListener() {
      return this.messageSubject.asObservable();
    }

    addNewsMail(emailToAdd: string) {
        const email = {email: emailToAdd};
        this.http.post<{message: string}>(this.BACKEDEND_URL+'/newsMail', email)
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

    sendNewsMailToAll(subject: string, text: string) {
      const mailBody = {
        subject,
        text
      };
      this.http.post(this.BACKEDEND_URL+'/newsMail/sendNewsMail', mailBody)
      .subscribe(response => {
        console.log('hello');
      });
    }

    sendNewsMailOnEventupdate(eventId: string) {
      const Id = {
        id: eventId
      };
      this.http.post(this.BACKEDEND_URL+'/newsMail/eventUpdated', Id)
      .subscribe(response => {

      });
    }

    sendNewsMailOnEventDelete(eventId: string) {
      const Id = {
        id: eventId
      };
      this.http.post(this.BACKEDEND_URL+'/eventDeleted', Id)
      .subscribe(response => {

      });
    }

    sendNewsAboutNewEvent(event: IEvent, address: IAddress) {
      this.sendNewsMailToAll('NYT ARRANGEMENT 🎉🎉',
      'Der er blevet oprttet et nyt arrangement på vores side \n'
      + 'Navn :' + event.name
      + 'Adresse : ' + address.line
      + 'Pris : ' + event.cost);
    }



    unsubscribeNews(email:string){
      const emailObject = {
        email
      };
      this.http.post<{message: string}>('http://localhost:3000/newsMail/unsubscribeMail', emailObject)
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
  }
