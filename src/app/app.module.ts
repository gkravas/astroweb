import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes }   from '@angular/router';

import { AuthorizationService } from './services/authorization.service';
import { StorageService } from './services/storage.services';
import { AuthenticationService } from './services/authentication.service';
import { NatalDatesService } from './services/natalDates.service';
import { TokenInterceptor } from './services/token.interceptor';
import { AppComponent } from './app.component';

import { LandingPageComponent } from './landingPage/landingPage.component';
import { LoginRegisterComponent } from './loginRegister/loginRegister.component';
import { DailyPredictionListComponent } from './dailyPredictionList/dailyPredictionList.component';
import { DailyPredictionComponent } from './dailyPrediction/dailyPrediction.component';
import { ErrorDialogComponent } from './errorDialog/errorDialog.component';
import { LoggedInPolicy } from './policies/loggedInPolicy.module';
import { Config } from './config.module';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'daily/:name',
    component: DailyPredictionListComponent,
    canActivate: [LoggedInPolicy],
    data: { state: 'dailyList' }
  },
  {
    path: 'daily/:name/:date',
    component: DailyPredictionComponent,
    canActivate: [LoggedInPolicy],
    data: { state: 'dailyPrediction' }
  }
 ];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, {useHash: false})
  ],
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginRegisterComponent,
    DailyPredictionListComponent,
    DailyPredictionComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  providers: [
    AuthorizationService,
    StorageService,
    AuthenticationService,
    NatalDatesService,
    LoggedInPolicy,
    Config,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
