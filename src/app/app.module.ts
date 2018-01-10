import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule, Routes }   from '@angular/router';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2Facebook } from 'angulartics2/facebook'
import { FacebookModule } from 'ngx-facebook';
import { ServiceWorkerModule } from '@angular/service-worker';

import { SharedModule } from "./shared.module";
import { CommonComponentsModule } from "./common.components.module";

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landingPage/landingPage.component';
import { TermsComponent } from './staticPages/terms/terms.component';
import { AboutComponent } from './staticPages/about/about.component';
import { PrivacyComponent } from './staticPages/privacy/privacy.component';
import { ErrorDialogComponent } from './errorDialog/errorDialog.component';
import { LoggedInPolicy } from './policies/loggedInPolicy.module';
import { AppPreloadingStrategy } from './app.preload.strategy';
import * as Raven from 'raven-js';

import { environment } from '../environments/environment';

Raven
.config('https://d8733f14ea10450494d6dbd667241f5b@sentry.io/264408')
.install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError || err);
  }
}

import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: { preload: true, delay: false }
  },
  {
    path: 'login',
    loadChildren: './loginRegister/loginRegister.module#LoginRegisterModule',
    canActivate: [LoggedInPolicy],
    data: { preload: true, delay: false }
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: { preload: true, delay: false }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { preload: true, delay: false }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: { preload: true, delay: false }
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    data: { preload: true, delay: false }
  },
  {
    path: 'daily/:name',
    loadChildren: './dailyPredictionList/dailyPredictionList.module#DailyPredictionListModule',
    canActivate: [LoggedInPolicy],
    data: { preload: true, delay: false }
  },
  {
    path: 'daily/:name/:date',
    loadChildren: './dailyPrediction/dailyPrediction.module#DailyPredictionModule',
    canActivate: [LoggedInPolicy],
    data: { preload: true, delay: false }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInPolicy],
    data: { preload: true, delay: false }
  },
  {
    path: '**',
    redirectTo: ''
  },
 ];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'astroweb' }),
    SharedModule.forRoot(),
    BrowserTransferStateModule,
    CommonComponentsModule,
    HttpClientModule,
    FlexLayoutModule,
    ApolloModule,
    HttpLinkModule,
    RouterModule.forRoot(routes, {
      useHash: false, 
      preloadingStrategy: AppPreloadingStrategy
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics, Angulartics2Facebook ]),
    HttpClientJsonpModule,
    FacebookModule.forRoot(),
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    LandingPageComponent,
    TermsComponent,
    AboutComponent,
    PrivacyComponent,
    ProfileComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  providers: [
    LoggedInPolicy,
    AppPreloadingStrategy,
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: environment.baseUrl + '/graphql' }),
      cache: new InMemoryCache()
    });
  }
}

export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : {
    clear: function(){},
    getItem: function(key){ return ""},
    setItem: function(key, value){}
  };
}
