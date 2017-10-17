import {Component, OnInit} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
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
    private titleDate: string;
    constructor(private location: Location, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.date = this.route.snapshot.paramMap.get('date');
        this.titleDate = moment(this.date, 'DDMMYYYY').locale('el').format('d MMM YYYY');
    }

    public goBack() {
        this.location.back();
    }
}