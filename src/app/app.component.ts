import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AuthenticateService } from './Auth/Authenticate.service';
import { Observable, Subscription } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  @ViewChild('drawer') sidenav: MatSidenav;
  isLoading;
   view = "Normal"; 


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private authService: AuthenticateService, private breakpointObserver: BreakpointObserver, private router: Router) {}
  ngOnInit() {
    this.authService.authenticateAutomatically();
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAutheticated => {
    this.userIsAuthenticated = isAutheticated;
  });

}

onRequestedEvents() {
  this.isLoading = true;
  this.router.navigate(['requestedEvents/true']);
  this.isLoading = false;
}

onLogout() {
  this.isLoading = true;
  this.authService.logout();
  this.isLoading = false;
}
ngOnDestroy() {
  this.authListenerSubs.unsubscribe();
}

toggleSidenav() {
  this.sidenav.toggle();
}

changeView() {
  if(this.router.url == "/events") {
  this.router.navigate(['/allEvents']);
  this.view = "Normal"
  
} else{
  this.router.navigate(['/events']);
  this.view = "Liste"

}
}

}
