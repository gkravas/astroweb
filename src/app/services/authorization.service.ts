import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from './storage.service';
@Injectable()
export class AuthorizationService {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private storageService: StorageService) { }

  public getToken(): string {
    return this.storageService.getToken();
  }

  public setToken(token: string) {
    this.storageService.setToken(token);
  }

  public isAuthenticated(): boolean {
    if (!this.getToken()) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  public getPublicData(): any {
    if (!this.getToken()) {
      return null;
    }
    return this.jwtHelper.decodeToken(this.getToken());
  }
}