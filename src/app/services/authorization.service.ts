import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
@Injectable()
export class AuthorizationService {

  private jwtHelper: JwtHelper = new JwtHelper();

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string) {
    return localStorage.setItem('token', token);
  }

  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }
}