import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../User.model';
import { AuthenticateService } from '../Authenticate.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { isUndefined } from 'util';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['ID', 'E-mail', 'Ny Adgangskode', 'Slet Bruger'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  message: { message: string; isErrorMessage: boolean; fadingTime: number; };
  errorDataSubs: Subscription;
  isLoading;

  constructor(private authService: AuthenticateService) { }

  ngOnInit() {
  this.authService.getAllUsers();
  this.authService.getUsersChangedListener().subscribe(users => {
    this.dataSource = new MatTableDataSource<User>(users);
    this.dataSource.paginator = this.paginator;
  });
  this.handleErrorMessage();
  }


handleErrorMessage() {
  this.errorDataSubs = this.authService.getMessageListener()
  .subscribe(messageData => {
    this.message = messageData;
    setTimeout(() => {
      this.message = undefined;
    }, messageData.fadingTime);
  });
}

  deleteUser(userId) {
    this.isLoading = true;
    this.authService.deleteUser(userId);
    this.isLoading = false;
  }

  resetUserPassword(userEmail: string) {
    this.isLoading = true;
    this.authService.resetUserPassword(userEmail);
    this.isLoading = false;
  }
}
