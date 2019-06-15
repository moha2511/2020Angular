import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticateService } from './Authenticate.service';

@Injectable()
export class AuthGard implements CanActivate {

    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

    constructor(private authService: AuthenticateService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {

        const isAuthenticated = this.authService.getIsAuthenticated();
        if (isAuthenticated) {
            return true;
        } else {
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }



}
