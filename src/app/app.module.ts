import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateEventComponent } from './Event/create-event/create-event.component';
import { EventListComponent } from './Event/event-list/event-list.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetterFromStorage } from './Auth/token.middleware';
import { LayoutModule } from '@angular/cdk/layout';
import { EventFormComponent } from './Event/event-form/event-form.component';
import { AddressFormComponent } from './Event/address-form/address-form.component';
import { ContactPersonFormComponent } from './Event/contact-person-form/contact-person-form.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbModule, NgbTimepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EventDialogComponent } from './dialogs/event-dialog/event-dialog.component';
import { NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from './Auth/change-password/change-password.component';
import { AngularMaterialModule } from './anuglar-material.module';
import { StartSiteComponent } from './start-site/start-site.component';
import { EmailDialogComponent } from './dialogs/email-dialog/email-dialog.component';
import { EditUsersComponent } from './Auth/edit-users/edit-users.component';
import { EventListTableComponent } from './Event/event-list-table/event-list-table.component';
import { NewsComponent } from './dialogs/news/news.component';
import { UnsubscribeNewsComponent } from './Mail/unsubscribe-news/unsubscribe-news.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateEventComponent,
    EventListComponent,
    LoginComponent,
    SignUpComponent,
    EventFormComponent,
    AddressFormComponent,
    ContactPersonFormComponent,
    EventDialogComponent,
    ChangePasswordComponent,
    StartSiteComponent,
    EmailDialogComponent,
    EditUsersComponent,
    EventListTableComponent,
    NewsComponent,
    UnsubscribeNewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    NgbTimepickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbAlertModule,
    NgbDropdownModule,
    AngularMaterialModule,
    JwtModule.forRoot(
      {
        config: {
          tokenGetter: tokenGetterFromStorage,
          whitelistedDomains: ['http://localhost:4200/'],
          blacklistedRoutes: []
        }
      }),
    LayoutModule,
  ],
  entryComponents: [
    EventDialogComponent,
    EmailDialogComponent,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})


export class AppModule { }
