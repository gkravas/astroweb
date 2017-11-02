import {Component, OnInit} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';

import * as moment from 'moment';

@Component({
  selector: 'daily-prediction',
  templateUrl: 'dailyPrediction.component.html',
  styleUrls: ['dailyPrediction.component.css']
})
export class DailyPredictionComponent implements OnInit {

    private date: string;
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private titleService: Title) {}

    ngOnInit() {
        this.date = this.route.snapshot.paramMap.get('date');
        this.titleService.setTitle(moment(this.date, 'DDMMYYYY').locale('el').format('d MMM YYYY'));
    }
}