import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { NatalDate, Coordinates } from '../models/natalDate';
import { Config } from '../config.module';

@Injectable()
export class NatalDatesService {
  
  constructor(private config: Config, private http: HttpClient) { }

  public getAll(): Promise<Array<NatalDate>> {
    return this.http.get<Array<NatalDate>>(this.config.BASE_URL + '/natalDate')
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error(error);
    return Promise.reject(error);
  }
}