import { Component } from '@angular/core';
import { routerTransition } from './router.transitions'
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/filter";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent {
  constructor(private router: Router) {}

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
