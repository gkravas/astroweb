import { PreloadingStrategy, Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { flatMap, delay } from 'rxjs/operators';

export class AppPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        const loadRoute = (delay) => delay
            ? delay(150).pipe(flatMap(_ => load()))
            : load();
        return route.data && route.data.preload 
            ? loadRoute(route.data.delay)
            : of(null);
      }
}