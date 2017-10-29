import {Input, Component} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";
import * as moment from 'moment';

@Component({
  selector: 'daily-prediction-list',
  templateUrl: 'dailyPredictionList.component.html',
  styleUrls: ['dailyPredictionList.component.css']
})
export class DailyPredictionListComponent {

    private static readonly MAX_DAYS_FORWARD: number = 30;
    private static readonly ADVERTISING_ID: number = -1;

    public cols: Observable<number>;
    public availableDates: Array<number> = [];
    public dayImages: Array<string> = [
        'assets/sun.svg',
        'assets/moon.svg',
        'assets/mars.svg',
        'assets/mercury.svg',
        'assets/jupiter.svg',
        'assets/venus.svg',
        'assets/saturn.svg',
    ];

    public dayImageNames: Array<string> = [
        "Sun's image",
        "Moon's image",
        "Mars' image",
        "Mercury's image",
        "Jupiter's image",
        "Venus' image",
        "Saturn's image"
    ];

    constructor(private observableMedia: ObservableMedia,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: Title) {}

    ngOnInit() {
        const grid = new Map([
          ["xs", 1],
          ["sm", 2],
          ["md", 2],
          ["lg", 2],
          ["xl", 3]
        ]);
        let start: number;
        grid.forEach((cols, mqAlias) => {
          if (this.observableMedia.isActive(mqAlias)) {
            start = cols;
          }
        });
        this.cols = this.observableMedia.asObservable()
          .map(change => {
            return grid.get(change.mqAlias);
          })
          .startWith(start);
        
        const now = moment();
        this.availableDates.push(now.unix())
        this.availableDates.push(DailyPredictionListComponent.ADVERTISING_ID);

        for(var i: number = 1; i < DailyPredictionListComponent.MAX_DAYS_FORWARD; i++) {
            now.add(1, 'days');
            this.availableDates.push(now.unix())
            if (i % 5 == 0) {
                this.availableDates.push(DailyPredictionListComponent.ADVERTISING_ID);
            }
        }
    }

    public formatDate(timestamp: number): string {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return "Διαφήμιση";
        } else {
            return moment.unix(timestamp).locale('el').format('dddd, D MMM YYYY');
        }
    }

    public getDayImage(timestamp: number): string {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return "assets/advertisement.jpg";
        } else {
            return this.dayImages[Number.parseInt(moment.unix(timestamp).format('d')) % 7];
        }
    }

    public getDayImageName(timestamp: number): string {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return "Advertising image";
        } else {
            return this.dayImageNames[Number.parseInt(moment.unix(timestamp).format('d')) % 7];
        }
    }

    public openPrediction(timestamp: number) {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return;
        }
        this.router.navigate(['daily/me/' + moment.unix(timestamp).format('DDMMYYYY')])
    }

    public getActionLemma(timestamp: number): string {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return "ΔΙΑΦΗΜΙΣΗ";
        } else {
            return "ΑΝΑΓΝΩΣΗ"
        }
    }
}