import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateService } from './Authenticate.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

constructor( private authServie: AuthenticateService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authServie.getToken();

        const authRequest = req.clone({
            headers: req.headers.set('authorization', 'Bearer ' + authToken)

        });
        return next.handle(authRequest);
    }
}
