import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule, Routes }   from '@angular/router';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AdsenseModule } from 'ng2-adsense';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { FacebookModule } from 'ngx-facebook';

import { AuthorizationService } from './services/authorization.service';
import { StorageService } from './services/storage.service';
import { AuthenticationService } from './services/authentication.service';
import { NatalDatesService } from './services/natalDates.service';
import { TokenInterceptor } from './services/token.interceptor';
import { provideClient } from './services/graphql';
import { AppComponent } from './app.component';

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
import { ErrorDialogComponent } from './errorDialog/errorDialog.component';
import { LoggedInPolicy } from './policies/loggedInPolicy.module';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: { state: 'landing' }
  },
  {
    path: 'login',
    component: LoginRegisterComponent,
    data: { state: 'login' }
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: { state: 'terms' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { state: 'about' }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: { state: 'privacy' }
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
    data: { state: 'resetPassword' }
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
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes, {useHash: false}),
    ApolloModule.forRoot(provideClient),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    AdsenseModule.forRoot({ adClient: 'ca-pub-6040563814771861' }),
    HttpClientJsonpModule,        // (Optional) for linkedIn and tumblr share counts
    ShareButtonsModule.forRoot(),
    FacebookModule.forRoot()
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
