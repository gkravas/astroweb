import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service'

@Component({
  selector: 'footer-main',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent {
  loggedIn: boolean = false;
  
  constructor(private authorizationService: AuthorizationService){
    this.loggedIn = this.authorizationService.isAuthenticated();
  }
}