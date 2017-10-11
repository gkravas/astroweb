import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthenticationService {

  private baseUrl: string = 'http://localhost:3000/api/v1/auth/';
  private token: string;
  
  constructor(private http: HttpClient, private authorizationService:AuthorizationService) { }

  public login(email: string, password: string): Promise<User> {
    const body: any = {email: email, password: password};
    return this.http.post<LoginResponse>(this.baseUrl + 'login', body)
      .toPromise()
      .then(json => {
        this.authorizationService.setToken(json.token);
        return json.user as User
      })
      .catch(this.handleError);
  }

  public register(email: string, password: string, date: string, time:string, location:string, type:string): Promise<boolean> {
    const body: any = {
      email: email, 
      password: password,
      birthDate: date + ' ' + time + ':00',
      birthLocation: location,
      type: type
    };
    return this.http.post<boolean>(this.baseUrl + 'register', body)
      .toPromise()
      .then(response => true)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }
  
}

interface LoginResponse {
  user: User;
  token: string;
}