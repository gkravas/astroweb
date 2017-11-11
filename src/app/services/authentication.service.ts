import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';
import { AuthorizationService } from '../services/authorization.service';
import { Config } from '../config.module';

@Injectable()
export class AuthenticationService {

  private token: string;
  
  constructor(private config: Config,
              private http: HttpClient,
              private authorizationService:AuthorizationService) { }

  public login(email: string, password: string): Promise<User> {
    const that = this;
    const body: any = {email: email, password: password};
    return this.http.post<LoginResponse>(this.config.BASE_URL + '/api/v1/auth/login', body)
      .toPromise()
      .then(json => {
        that.authorizationService.setToken(json.token);
        return json.user as User
      });
  }

  public register(email: string, password: string, date: string, time:string, location:string, type:string): Promise<boolean> {
    const body: any = {
      email: email, 
      password: password,
      birthDate: date + ' ' + time + ':00',
      birthLocation: location,
      type: type
    };
    return this.http.post<boolean>(this.config.BASE_URL + '/api/v1/auth/register', body)
      .toPromise()
      .then(response => {
        return true;
      });
  }

  public resetPassword(password: string): Promise<boolean> {
    const body: any = {
      password: password,
    };
    return this.http.post<boolean>(this.config.BASE_URL + '/api/v1/auth/resetPassword', body)
      .toPromise()
      .then(response => true)
  }

  public sendResetEmail(email: string): Promise<boolean> {
    const body: any = {
      email: email,
    };
    return this.http.post<boolean>(this.config.BASE_URL + '/api/v1/auth/sendResetEmail', body)
      .toPromise()
      .then(response => true)
  }
}

interface LoginResponse {
  user: User;
  token: string;
}