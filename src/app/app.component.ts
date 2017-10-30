import { Component } from '@angular/core';
import { routerTransition } from './router.transitions'
import { NavigationEnd, Router } from '@angular/router';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/filter";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent {
  constructor(private router: Router, private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
