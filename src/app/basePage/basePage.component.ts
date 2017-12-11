import {Input, Component} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";

@Component({
  selector: 'base-page',
  templateUrl: 'basePage.component.html',
  styleUrls: ['basePage.component.scss']
})
export class BasePageComponent {
    @Input() title: string;
    @Input() showMenu: boolean;

    constructor(private observableMedia: ObservableMedia,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title) {}

    ngOnInit() {
        this.titleService.setTitle(this.title);
    }
}