import { PLATFORM_ID, Inject, Input, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';

import { User } from '../models/user';
import { NatalDate } from '../models/natalDate';
import { checkIfMatchingPasswords } from '../validators/matchingValidator';
import { isPlatformServer } from '@angular/common/src/platform_id';

@Component({
  selector: 'login-register',
  templateUrl: 'loginRegister.component.html',
  styleUrls: ['loginRegister.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ height: '*', opacity: 1 })),
      state('hidden', style({ height: '0', opacity: 0, padding: 0, display: 'none' })),
      transition('shown => hidden', animate('400ms ease-in')),
      transition('hidden => shown', animate('400ms ease-out')),
    ])
  ]
})
export class LoginRegisterComponent {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private authenticationService: AuthenticationService,
    private storageService: StorageService, 
    private titleService: Title,
    private dialog: MatDialog,
    private angulartics2: Angulartics2GoogleAnalytics,
    private fb: FacebookService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object) {
      if(isPlatformBrowser(this.platformId)) {
        let initParams: InitParams = {
          appId: environment.fbAppId,
          xfbml: true,
          version: 'v2.11'
        };
    
        fb.init(initParams);
      }
  }
  
  private static FB_LOGIN_FAILED: string = 'fb_login_failed';
  private fbToken: string;

  //form fiels
  emailField: string = "";
  passwordField: string = "";
  passwordRepeatField: string = "";

  //State
  passwordHide: boolean = true;
  passwordRepeatHide: boolean = true;
  isLogin: boolean = false;
  fbLogin: boolean = false;
  showReset: string = !this.isLogin ? 'hidden' : 'shown';
  showExtra: string = this.isLogin ? 'hidden' : 'shown';
  showPassword: string = 'shown';
  showLoader: string = 'hidden';
  showLoginRegister: string = 'shown';
  emailError: string = '';

  //validation
  
  form: FormGroup;

  //methods
  ngOnInit() {
    this.setLoginState(this.route.snapshot.queryParamMap.get('register') != '1');
    this.fbLogin = this.route.snapshot.queryParamMap.get('fbLogin') == '1';
    this.titleService.setTitle('Είσοδος / Εγγραφή');

    this.form = this.formBuilder.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required, checkIfMatchingPasswords('password', 'passwordRepeat')]]
    });
  }

  onToggleState() {
    this.setLoginState(!this.isLogin);
  }

  setLoginState(isLogin: boolean) {
    this.isLogin = isLogin;
    this.showExtra = this.isLogin ? 'hidden' : 'shown';
    this.showReset = !this.isLogin ? 'hidden' : 'shown';
  }

  showLoading(visible: boolean) {
    this.showLoader = visible ? 'shown' : 'hidden';
    this.showLoginRegister = !visible ? 'shown' : 'hidden';
  }

  fbConnect() {
    if(!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.form.disable();
    this.showLoading(true);
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile, email'
    };
    //'public_profile, user_birthday, email, user_hometown'
    this.angulartics2.eventTrack('tryToConnectWithFB', {});
    const that = this;
    this.fb.login(loginOptions)
      .then((loginResponse: LoginResponse) => {
        //connected, not_authorized, unknown
        if (loginResponse.status != 'connected') {
          throw Error(LoginRegisterComponent.FB_LOGIN_FAILED);
        }
        
        if (loginResponse.authResponse.grantedScopes.indexOf('public_profile') == -1) {
          throw Error("Δεν μας έδωσες πρόσβαση στο δημόσιο προφίλ σου!")
        }
        if (loginResponse.authResponse.grantedScopes.indexOf('email') == -1) {
          throw Error("Δεν μας έδωσες πρόσβαση στο email σου!")
        }
        that.fbToken = loginResponse.authResponse.accessToken;
        this.angulartics2.eventTrack('tryToConnectWithFBSuccess', {});
        return this.login(null, null, that.fbToken, 'userLoggedInFB');
      })
      .catch(error => {
        this.angulartics2.eventTrack('tryToConnectWithFBFail', {});
        this.showErrorDialog('Προσοχή', error.message);
        this.form.enable();
        this.showLoading(false);
      })
  }

  onSubmit() {
    if (this.isLogin && this.form.get('email').valid && this.form.get('password').valid) {
      this.angulartics2.eventTrack('tryToLogin', {});
      this.showLoading(true);
      this.login(this.emailField, this.passwordField, this.fbToken, 'userLoggedIn');
    } else {
      this.angulartics2.eventTrack('tryToRegister', {});
      this.form.get('passwordRepeat').updateValueAndValidity();
      this.form.get('passwordRepeat').markAsTouched();
      if (this.form.valid){
        this.showLoading(true);
        this.authenticationService.register(this.emailField, this.passwordField, this.fbToken)
          .then((o) => {
            this.angulartics2.eventTrack('newUser', {});
            return this.login(this.emailField, this.passwordField, this.fbToken, 'userLoggedInFirstTime')
          })
          .catch(error => {
            this.angulartics2.eventTrack('tryToRegisterFail', {});
            this.handleError(error)
          });
      }
    }
  }

  sendResetEmail() {
    if (!this.form.get('email').valid) {
      this.form.get('email').markAsTouched();
      return;
    }

    const that = this;
    this.authenticationService.sendResetEmail(this.emailField)
      .then(function(allGood:boolean) {
        this.angulartics2.eventTrack('sendResetEmail', {});
        that.showErrorDialog('Προσοχή', 'Μόλις σου αποστείλαμε email για την αλλαγή του κωδικού σου.')
      })
      .catch(error => that.handleError(error));
  }

  login(username: string, password: string, fbToken: string, event: string): Promise<any> {
    const that = this;
    return this.authenticationService.login(username, password, fbToken)
      .then((user: User) => {
        this.angulartics2.eventTrack(event + 'Success', {});
        that.apollo.getClient().cache.reset();
        return that.router.navigate(['/daily/me']);
      })
      .catch(error => {
        this.angulartics2.eventTrack(event + 'Fail', {});
        that.handleError(error)
      });
  }

  hasValidationErrors(controls: [FormControl]): boolean {
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].errors != null) {
        return true;
      }
    }
    return false;
  }

  handleError(response: HttpErrorResponse) {
    console.log(response);
    var title: string = 'Προσοχή';
    var message: string;
    switch (response.status) {
      case 401:
        message = 'Το email ή ο κωδικός πρόσβασης δεν είναι σωστά!';
        break;
      case 400:
        var err = response.error.error;
        
        if (err.name == 'ExternalServiceError' && err.type == 'timezone error') {
          message = 'Δεν βρέθηκε ο τόπος γέννησης, πάντα σύμφωνα με την google... :) ';
        } else if (err.name = 'ServiceError') {
          if (err.field == 'email') {//err.type == 'unique violation'
            switch(err.type) {

              case 'unique violation':
                message = 'To email αυτό έχει ήδη λογιαριασμό';
              break;

              case 'notNull violation':
                message = 'Δεν μας έγραψες τo email σου';
              break;

              default:
                message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
            }
          }
        }
        break;
      default:
        message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
    }
    this.form.enable();
    this.showLoading(false);
    this.showErrorDialog(title, message);
  }

  showErrorDialog(title: string, message: string) {
    let dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { 
        title: title, 
        message: message,
        positive: 'OK'
       }
    });
  }
}