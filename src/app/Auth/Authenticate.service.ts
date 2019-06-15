import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserWithID } from './User.model';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {
    private users: UserWithID[];
    private usersChangedSubject = new Subject<UserWithID[]>();
    private isAuthenticated = false;
    private jwt;
    private authStatusListner = new Subject<boolean>();
    private userId = 'arranger';
    private tokenTimer: NodeJS.Timer;
    private errorListener = new Subject<{message: string, isErrorMessage: boolean, fadingTime: number}>();
    private BACKEDEND_URL = 'https://newmousleheventappp.herokuapp.com';
    constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {

    }


getUsersChangedListener() {
 return this.usersChangedSubject.asObservable();
}


isAdmin() {
    if (this.getUserId() === '5cd9b7145437172e109998d8') {
        return true;
    }
    return false;
}
    getMessageListener() {
        return this.errorListener.asObservable();
    }

    login(user: User) {
        this.http.post<{ token: string, expiresIn: number, userId: string }>(this.BACKEDEND_URL + '/user/login/', user)
            .subscribe(data => {
                const token = data.token;

                if (token) {
                    const tokenExpiresIn = data.expiresIn;
                    this.setAuthTimer(tokenExpiresIn);
                    this.jwt = token;
                    this.isAuthenticated = true;
                    this.userId = data.userId;
                    this.saveAuthData(token, this.getTokenExpirationDate(token), this.userId);
                    this.authStatusListner.next(true);
                    this.router.navigate(['/allEvents']);
                }
            }, errorData => {
                this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
            });
    }


    changePassword(oldPassword, newPassword) {
        const user = {
            oldPassword,
            newPassword
        };
        this.http.put<{message: string}>(this.BACKEDEND_URL + '/user/change/', user)
        .subscribe(result => {
            this.errorListener.next({message: result.message, isErrorMessage: false, fadingTime: 3000});
        }, errorData => {
            this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
        });
    }

    createUser(user: User) {

        this.http.post<{message: string, user: any}>(this.BACKEDEND_URL + '/user/signup/', user)
            .subscribe(result => {
                this.errorListener.next({message: result.message, isErrorMessage: false, fadingTime: 3000});
                this.router.navigate(['/allEvents']);
            }, errorData => {
                this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
            }

            );
    }


     getAllUsers() {
        this.http.get<{user: UserWithID[]}>(this.BACKEDEND_URL + '/user/')
            .subscribe(result => {
                this.users = [...result.user];
                this.usersChangedSubject.next(this.users);
            }, errorData => {
                this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
            }
            );
    }

    deleteUser(id) {
        this.http.delete<{message: string}>(this.BACKEDEND_URL + '/user/' + id)
        .subscribe(response => {
                this.errorListener.next({message: response.message, isErrorMessage: false, fadingTime: 3000});
                this.usersChangedSubject.next(this.users.filter(user => user._id !== id));
            }, errorData => {
                this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
            }
        );
    }

    resetUserPassword(userEmail: string) {
        console.log(userEmail);
        this.http.put<{message: string}>(this.BACKEDEND_URL + '/user/resetPassword', {email: userEmail})
        .subscribe(response => {
            this.errorListener.next({message: response.message, isErrorMessage: false, fadingTime: 3000});
        }, errorData => {
            this.errorListener.next({message: errorData.error.message, isErrorMessage: true, fadingTime: 3000});
        }
    );
    }
    getTokenExpirationDate(token) {
        return this.jwtHelper.getTokenExpirationDate(token);
    }
    logout() {
        this.jwt = false;
        this.isAuthenticated = false;
        this.authStatusListner.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = 'arranger';
        this.router.navigate(['']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    authenticateAutomatically() {
        const authData = this.getAuthData();
        if (!authData) {
            return;
        }
        const now = new Date();
        const expiresIn = authData.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.jwt = authData.jwt,
            this.isAuthenticated = true;
            this.userId = authData.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListner.next(true);
        }

    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if (!token || !expirationDate) {
            return;
        }
        return {
            jwt: token,
            // tslint:disable-next-line: object-literal-shorthand
            expirationDate: new Date(expirationDate),
// tslint:disable-next-line: object-literal-shorthand
            userId: userId
        };

    }

    getToken() {
        return this.jwt;
    }
    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListner.asObservable();
    }
    getUserId() {

        return this.userId;
    }

}
