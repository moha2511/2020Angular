import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { User } from '../../Auth/User.model';
import { Subscription } from 'rxjs';
import { IMyEventRoot } from '../IMyEventRoot.interface';
import {EventService } from '../event.service';
import { formatDate } from '../event-list/event-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { constructor } from 'q';


@Component({
  selector: 'app-event-list-table',
  templateUrl: './event-list-table.component.html',
  styleUrls: ['./event-list-table.component.css']
})
export class EventListTableComponent implements OnInit {


  dataSource: MatTableDataSource<IMyEventRoot>;
  displayedColumns: string[] = [ 'select', 'Navn', 'Addresse', 'By', 'Kategori' , 'Start Tid', 'Slut Tid', 'Pris', 'Alder', ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  message: { message: string; isErrorMessage: boolean; fadingTime: number; };
  errorDataSubs: Subscription;
  currentPage = 1;
  eventsPerPage = 5;
  updatedEventsSubs: Subscription;
  selection;
  viewName = 'Liste';

  constructor(private eventService: EventService) { }

  ngOnInit() {
  const initialSelection = [];
  const allowMultiSelect = false;
  this.selection = new SelectionModel<IMyEventRoot>(allowMultiSelect, initialSelection);
  this.eventService.getLimitedAmountOfEvents(this.eventsPerPage, this.currentPage);
  this.getEvents();

  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.eventsPerPage = pageData.pageSize;
    this.eventService.getLimitedAmountOfEvents(this.eventsPerPage, this.currentPage);
  }

  getEvents() {
    this.eventService.getLimitedAmountOfEvents(this.eventsPerPage, this.currentPage);
    this.updatedEventsSubs = this.eventService
      .eventsUpdatedSubjectListener()
      .subscribe(eventData => {
        // this.isLoading = true;
// tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < eventData.events.length; i++) {
     eventData.events[i].startTime = formatDate(formatDate(eventData.events[i].startTime));
     eventData.events[i].endTime = formatDate(formatDate(eventData.events[i].endTime));
    }

    this.dataSource = new MatTableDataSource<IMyEventRoot>(eventData.events);
    this.dataSource.paginator = this.paginator;
       // this.isLoading = false;
      });
  }

  changedView() {
    if (this.viewName === 'Liste') {
      this.viewName = 'Normal';
    } else {
      this.viewName = 'Liste';
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
