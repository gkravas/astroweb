import { Component, OnInit, Input, Output } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';

import { MatSnackBar, MatSlider } from '@angular/material'

import * as moment from 'moment';

import {DailyPrediction, PlanetExplanations} from '../models/dailyPrediction';

const GetDailyPrediction = gql`
query GetDailyPrediction($natalDateId: Int!, $date: String!) {
    dailyPrediction(natalDateId: $natalDateId, date: $date) {
      accuracy
      planetExplanations {
        title
        lemma
      }
    }
  }
`;

const RateDailyPrediction = gql`
mutation RateDailyPredectionAccuracy($natalDateId: Int!, $date: String!, $accuracy: Int!) {
    rateDailyPredectionAccuracy(input: {natalDateId: $natalDateId, date: $date, accuracy: $accuracy}) {
      accuracy
    }
  }
`;

@Component({
  selector: 'daily-prediction',
  templateUrl: 'dailyPrediction.component.html',
  styleUrls: ['dailyPrediction.component.css']
})
export class DailyPredictionComponent implements OnInit {

    @Input() title: string;
    
    private date: string;
    public dailyPrediction: Observable<DailyPrediction>;
    private accuracySubject: Subject<Number> = new Subject<Number>();
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
        private titleService: Title,
        public snackBar: MatSnackBar) {}

    ngOnInit() {
        const that = this;
        this.date = this.route.snapshot.paramMap.get('date');
        console.log(this.date);
        this.titleService.setTitle("Προβλέψεις για " + moment(this.date, 'DDMMYYYY').locale('el').format('D MMM YYYY'));
        this.title = this.titleService.getTitle();

        this.dailyPrediction = that.apollo.watchQuery({
            query: GetDailyPrediction,
            variables: {
                natalDateId: 1,
                date: moment(this.date, 'DDMMYYYY').format('YYYY-MM-DD')
            }
          })
          .map(result => {
            return (result.data['dailyPrediction'] as DailyPrediction);
          });

          this.dailyPrediction
            .subscribe((result) => {
            }, (error) => {
              this.showError();
            });

          this.dailyPrediction.subscribe();

          this.accuracySubject
            .debounceTime(1000)
            .flatMap((value) => {
              return this.apollo.mutate({
                mutation: RateDailyPrediction,
                variables: {
                    natalDateId: 1,
                    date: moment(that.date, 'DDMMYYYY').format('YYYY-MM-DD'),
                    accuracy: value
                }
              })
            })
            .subscribe((result) => {
              this.snackBar.open("Σε ευχαριστούμε για την βαθμολία σου!", "", {
                duration: 2000,
              });
            }, (error) => {
              this.showError();
            });
    }

    onAccuracyChanged(e) {
      this.accuracySubject.next(e.value * 10);
    }

    showError() {
      this.snackBar.open("Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!", "", {
        duration: 3000,
      });
    }
}