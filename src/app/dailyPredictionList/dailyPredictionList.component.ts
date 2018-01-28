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
    private static readonly AD_PER_PREDICTION: number = 5;

    public cols: Observable<number>;
    public availableDates: Array<number> = [];
    public dayImages: Array<string> = [
        'assets/default/1.jpg',
        'assets/default/2.jpg',
        'assets/default/3.jpg',
        'assets/default/4.jpg',
        'assets/default/5.jpg',
        'assets/default/6.jpg',
        'assets/default/7.jpg',
    ];

    public dayImagesWebp: Array<string> = [
        'assets/webp/1.webp',
        'assets/webp/2.webp',
        'assets/webp/3.webp',
        'assets/webp/4.webp',
        'assets/webp/5.webp',
        'assets/webp/6.webp',
        'assets/webp/7.webp',
    ];

    public dayImagesJp2: Array<string> = [
        'assets/jp2/1.jp2',
        'assets/jp2/2.jp2',
        'assets/jp2/3.jp2',
        'assets/jp2/4.jp2',
        'assets/jp2/5.jp2',
        'assets/jp2/6.jp2',
        'assets/jp2/7.jp2',
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
            if (i % DailyPredictionListComponent.AD_PER_PREDICTION == 0) {
                this.availableDates.push(DailyPredictionListComponent.ADVERTISING_ID);
            }
        }
    }

    public formatDate(timestamp: number): string {
        if (timestamp == DailyPredictionListComponent.ADVERTISING_ID) {
            return "Διαφήμιση";
        } else {
            return "Προβλέψεις για " + moment.unix(timestamp).locale('el').format('dddd, D MMM YYYY');
        }
    }

    public getDayImageJPG(timestamp: number): string {
        return this.dayImages[Number.parseInt(moment.unix(timestamp).format('d')) % 7];
    }

    public getDayImageWEBP(timestamp: number): string {
        return this.dayImagesWebp[Number.parseInt(moment.unix(timestamp).format('d')) % 7];
    }

    public getDayImageJP2(timestamp: number): string {
        return this.dayImagesJp2[Number.parseInt(moment.unix(timestamp).format('d')) % 7];
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