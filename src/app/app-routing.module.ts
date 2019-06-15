import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './Event/create-event/create-event.component';
import { EventListComponent } from './Event/event-list/event-list.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { AuthGard as AuthGuard } from './Auth/auth.guard';
import { ChangePasswordComponent } from './Auth/change-password/change-password.component';
import { StartSiteComponent } from './start-site/start-site.component';
import { EditUsersComponent } from './Auth/edit-users/edit-users.component';
import { EventListTableComponent } from './Event/event-list-table/event-list-table.component';
import { NewsComponent } from './dialogs/news/news.component';
import { UnsubscribeNewsComponent } from './Mail/unsubscribe-news/unsubscribe-news.component';


const routes: Routes = [
  {
    path: 'allEvents',
    component: EventListComponent
  },
  {
    path: '',
    component: StartSiteComponent
  },

  {
    path: 'create',
    component: CreateEventComponent
  },

  {
    path: 'edit/:eventId',
    component: CreateEventComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'requestedEvents/:isRequstedEvents',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/user',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editUsers',
    component: EditUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    component: EventListTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'createNews',
    component: NewsComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'unsubscribeNews',
  component: UnsubscribeNewsComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
