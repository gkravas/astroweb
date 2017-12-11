import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StorageService } from '../services/storage.service';
import { User } from '../models/user';
import { useAnimation } from '@angular/animations/src/animation_metadata';

const UpdateUser = gql`
mutation UpdateUser($location: String!) {
    updateUser(input: {location: $location}) {
      id
      email
      location
    }
  }
`;

@Injectable()
export class UserService {
    constructor(private apollo: Apollo,
                private storageService: StorageService) { }
    
      public updateUser(location: String): Observable<User> {
        return this.apollo.mutate({
            mutation: UpdateUser,
            variables: {
              "location": location
            }
        })
        .flatMap((result) => {
            const user: User = result.data['updateUser'] as User;
            this.storageService.setUser(user);
            return Observable.of(user);
        });
      };
}