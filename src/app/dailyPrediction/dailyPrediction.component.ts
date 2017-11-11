import {Component, OnInit} from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Location} from '@angular/common';
import gql from 'graphql-tag';

import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';

import * as moment from 'moment';

const GetDailyPrediction = gql`
query GetDailyPrediction($natalDateId: Int!, $date: String!) {
    dailyPrediction(natalDateId: $natalDateId, date: $date) {
      planetExplanations {
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

    private date: string;
    
    constructor(private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
        private titleService: Title) {}

    ngOnInit() {
        const that = this;
        this.date = this.route.snapshot.paramMap.get('date');
        this.titleService.setTitle(moment(this.date, 'DDMMYYYY').locale('el').format('d MMM YYYY'));

        that.apollo.query({
            query: GetDailyPrediction,
            variables: {
                natalDateId: 1,
                date: moment(this.date, 'DDMMYYYY').format('YYYY-MM-DD')
            }
          }).toPromise()
          .then(result => {
            
          });
    }

    rate(accuracy: number) {
        const that = this;
        that.apollo.query({
            query: RateDailyPrediction,
            variables: {
                natalDateId: 1,
                date: moment(that.date, 'DDMMYYYY').format('YYYY-MM-DD'),
                accuracy: accuracy
            }
          }).toPromise()
          .then(result => {
            
          });
    }
}