import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service'

@Component({
  selector: 'footer-landing',
  templateUrl: 'footerLanding.component.html',
  styleUrls: ['footerLanding.component.css']
})
export class FooterLandingComponent {
  loggedIn: boolean = false;
  
  constructor(private authorizationService: AuthorizationService){
    this.loggedIn = this.authorizationService.isAuthenticated();
  }
}