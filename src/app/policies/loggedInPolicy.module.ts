import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
import { NatalDatesService } from '../services/natalDates.service';
import { StorageService } from '../services/storage.service';
import { Observable } from 'rxjs/Observable';
import { NatalDate } from '../models/natalDate';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import { Apollo } from 'apollo-angular';

@Injectable()
export class LoggedInPolicy implements CanActivate {
  
  constructor(private apollo: Apollo,
    private router: Router,
    private authorizationService: AuthorizationService,
    private natalDatesService: NatalDatesService,
    private storageService: StorageService) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const path: string = route.url[route.url.length - 1].path;

    const that =  this;
    that.storageService.clear();
    return of(this.authorizationService.isAuthenticated())
      .flatMap((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          // if (path != 'login') {
          //   that.apollo.getClient().cache.reset();
          //   that.router.navigate(['/login']);
          //   return of(false);
          // } else {
            return of(true);
          // }
        } else {
          return Observable.create(observer => {
            that.storageService.clear();
            that.router.navigate(['']);
            return of(false);
          });
          // return Observable.create(observer => {
          //   if (that.storageService.getNatalDates().length == 0) {
          //     that.natalDatesService.getAll()
          //       .subscribe((natalDates: Array<NatalDate>) => {
          //         that.storageService.setNatalDates(natalDates);
          //         observer.next(natalDates);
          //         observer.complete();
          //       });
          //   } else {
          //     observer.next(that.storageService.getNatalDates());
          //     observer.complete();
          //   }
          // })
          // .flatMap((natalDates: Array<NatalDate>) => {
          //   if ((natalDates == null || natalDates.length == 0)) {
          //     if (path != 'profile') {
          //       that.router.navigate(['/profile']);
          //       return of(false);
          //     } else {
          //       return of(true);
          //     }
          //   } else {
          //     that.storageService.setNatalDates(natalDates);
          //     if (path == 'login') {
          //       that.router.navigate(['/daily/me']);
          //       return of(false);
          //     } else {
          //       return of(true);
          //     }
          //   }
          // })
        }
      });
  }
}