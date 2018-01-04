import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule, Routes }   from '@angular/router';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Angulartics2Facebook } from 'angulartics2/facebook'
import { FacebookModule } from 'ngx-facebook';

import { AuthorizationService } from './services/authorization.service';
import { StorageService } from './services/storage.service';
import { AuthenticationService } from './services/authentication.service';
import { NatalDatesService } from './services/natalDates.service';
import { UserService } from './services/user.service';
import { TokenInterceptor } from './services/token.interceptor';
import { AppComponent } from './app.component';

import { ProfileComponent } from './profile/profile.component';
import { LandingPageComponent } from './landingPage/landingPage.component';
import { LoginRegisterComponent } from './loginRegister/loginRegister.component';
import { ResetPasswordComponent } from './resetPassword/resetPassword.component';
import { BasePageComponent } from './basePage/basePage.component';
import { FooterLandingComponent } from './footerLanding/footerLanding.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TermsComponent } from './staticPages/terms/terms.component';
import { AboutComponent } from './staticPages/about/about.component';

import { PrivacyComponent } from './staticPages/privacy/privacy.component';
import { DailyPredictionListComponent } from './dailyPredictionList/dailyPredictionList.component';
import { DailyPredictionComponent } from './dailyPrediction/dailyPrediction.component';
import { DailyPredictionAdSenseComponent } from './adSense/dailyPredictionAdSense.component';
import { DailyPredictionListAdSenseComponent } from './adSense/dailyPredictionListAdSense.component';
import { ErrorDialogComponent } from './errorDialog/errorDialog.component';
import { LoggedInPolicy } from './policies/loggedInPolicy.module';
import * as Raven from 'raven-js';
import { PrebootModule } from 'preboot';

import { environment } from '../environments/environment';

Raven
.config('https://d8733f14ea10450494d6dbd667241f5b@sentry.io/264408')
.install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError || err);
  }
}

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginRegisterComponent,
    canActivate: [LoggedInPolicy]
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { state: 'about' }
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },
  {
    path: 'daily/:name',
    component: DailyPredictionListComponent,
    canActivate: [LoggedInPolicy]
  },
  {
    path: 'daily/:name/:date',
    component: DailyPredictionComponent,
    canActivate: [LoggedInPolicy]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInPolicy]
  },
  {path: '**', component: LandingPageComponent}
 ];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'astroweb' }),
    PrebootModule.withConfig({ appRoot: 'app-root' }),
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    ApolloModule,
    HttpLinkModule,
    RouterModule.forRoot(routes, {useHash: false, initialNavigation: 'enabled'}),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics, Angulartics2Facebook ]),
    HttpClientJsonpModule,
    FacebookModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginRegisterComponent,
    ResetPasswordComponent,
    BasePageComponent,
    FooterLandingComponent,
    FooterComponent,
    PrivacyComponent,
    TermsComponent,
    AboutComponent,
    HeaderComponent,
    DailyPredictionListComponent,
    DailyPredictionComponent,
    DailyPredictionAdSenseComponent,
    DailyPredictionListAdSenseComponent,
    ProfileComponent,
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
    UserService,
    LoggedInPolicy,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
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
