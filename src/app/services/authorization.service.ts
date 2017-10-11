import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class AuthorizationService {

    jwtHelper: JwtHelper = new JwtHelper();
  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string) {
    return localStorage.setItem('token', token);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    return this.jwtHelper.isTokenExpired(token);
  }
}