import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';
import { AuthorizationService } from '../services/authorization.service';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {

  private token: string;
  
  constructor(private http: HttpClient,
              private authorizationService:AuthorizationService,
              private storageService:StorageService) { }

  public login(email: string, password: string, fbToken: string): Promise<User> {
    return fbToken ? this.fbLogin(fbToken) : this.emailLogin(email, password);
  }

  public fbLogin(fbToken: string): Promise<User> {
    const that = this;
    const body: any = {fbToken: fbToken};
    return this.http.post<LoginResponse>(environment.baseUrl + '/api/v1/auth/fbLogin', body)
      .toPromise()
      .then(json => {
        that.authorizationService.setToken(json.token);
        return json.user as User
      });
  }

  public emailLogin(email: string, password: string): Promise<User> {
    const that = this;
    const body: any = {email: email, password: password};
    return this.http.post<LoginResponse>(environment.baseUrl + '/api/v1/auth/login', body)
      .toPromise()
      .then(json => {
        that.authorizationService.setToken(json.token);
        return json.user as User
      });
  }

  public register(email: string, password: string, fbToken: string): Promise<boolean> {
    const body: any = {
      email: email, 
      password: password,
      fbToken: fbToken
    };
    return this.http.post<boolean>(environment.baseUrl + '/api/v1/auth/register', body)
      .toPromise()
      .then(response => {
        return true;
      });
  }

  public resetPassword(password: string): Observable<boolean> {
    const body: any = {
      password: password,
    };
    return this.http.post<boolean>(environment.baseUrl + '/api/v1/auth/resetPassword', body);
  }

  public sendResetEmail(email: string): Promise<boolean> {
    const body: any = {
      email: email,
    };
    return this.http.post<boolean>(environment.baseUrl + '/api/v1/auth/sendResetEmail', body)
      .toPromise()
      .then(response => true)
  }

  public changeEmail(email: string): Observable<boolean> {
    const body: any = {
      email: email,
    };
    return this.http.post<boolean>(environment.baseUrl + '/api/v1/auth/changeEmail', body);
  }
}

interface LoginResponse {
  user: User;
  token: string;
}