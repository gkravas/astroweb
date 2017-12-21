import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { NatalDate, Coordinates } from '../models/natalDate';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../services/storage.service';

const GetNatalDates = gql`
query GetNatalDates {
  me {
      email,
      location,
      natalDates {
        id
        name
        date
        location
        primary
        type
      }
  }
}
`;

const CreateNatalDate = gql`
mutation CreateNatalDate($date: String!, $name: String!, $location: String!, $primary: Boolean, $type: String) {
  createNatalDate(input: {date: $date, name: $name, location: $location, primary: $primary, type: $type}) {
    id
    name
    date
    location
    primary
    type
  }
}
`;

const UpdateNatalDate = gql`
mutation UpdateNatalDate($id: Int, $date: String!, $name: String!, $location: String!, $primary: Boolean, $type: String) {
  updateNatalDate(input: {id: $id, date: $date, name: $name, location: $location, primary: $primary, type: $type}) {
    id
    name
    date
    location
    primary
    type
  }
}
`;

@Injectable()
export class NatalDatesService {
  
  constructor(private apollo: Apollo, private storageService: StorageService) { }

  public getAll(): Observable<Array<NatalDate>> {
    return this.apollo.watchQuery({
      query: GetNatalDates,
      fetchPolicy: 'network-only'
    })
    .valueChanges
    .map((result) => {
      const user: User = (result.data['me'] as User)
      this.storageService.setUser(user);
      this.storageService.setNatalDates(user.natalDates);
      return user.natalDates;
    });
  };

  public createNatalDate(date: string, name: string, location: string, 
                    primary: boolean, type: string): Observable<NatalDate> {
    return this.apollo.mutate({
      mutation: CreateNatalDate,
      variables: {
        "date": date,
        "name": name,
        "location": location,
        "primary": primary,
        "type": type
      }
    })
    .map((result) => {
      return result.data['createNatalDate'] as NatalDate;
    });
  };

  public updateNatalDate(id: number, date: string, name: string, location: string, 
    primary: boolean, type: string): Observable<NatalDate> {
    return this.apollo.mutate({
      mutation: UpdateNatalDate,
      variables: {
        "id": id,
        "date": date,
        "name": name,
        "location": location,
        "primary": primary,
        "type": type
      }
    })
    .map((result) => {
      return result.data['updateNatalDate'] as NatalDate;
    });
  };

  private handleError(error: any): Promise<any> {
    console.error(error);
    return Promise.reject(error);
  }
}