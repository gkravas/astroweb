import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthorizationService } from './services/authorization.service';
import { StorageService } from './services/storage.service';
import { AuthenticationService } from './services/authentication.service';
import { NatalDatesService } from './services/natalDates.service';
import { UserService } from './services/user.service';
import { TokenInterceptor } from './services/token.interceptor';

@NgModule({})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                AuthorizationService,
                StorageService,
                AuthenticationService,
                NatalDatesService,
                UserService,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: TokenInterceptor,
                  multi: true
                },
            ]
        };
    }
}