import { Input, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/toPromise';

import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { NatalDatesService } from '../services/natalDates.service';
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';

import { User } from '../models/user';
import { NatalDate } from '../models/natalDate';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DATE_REGEX = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

interface Type {
  id: string;
  name: string;
}

const CurrentUser = gql`
query CurrentUser {
  me {
      id
      email
      natalDates {
        id
        name
        primary
      }
  }
}
`;

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
    private natalDatesService: NatalDatesService,
    private titleService: Title,
    private dialog: MatDialog,
    private angulartics2: Angulartics2GoogleAnalytics) {}
  
  private currentUserSub: Subscription;

  types: Array<Type> = [
    {id: 'male', name: "Άνδρας"},
    {id: 'female', name: "Γυναίκα"},
    {id: 'freeSperit', name: "Ελεύθερη Ψυχή"}
  ];
  //form fiels
  emailField: string = "";
  passwordField: string = "";
  birthPlaceField: string = "";
  birthDateField: string = "";
  birthTimeField: string = "";
  typeField: string = "";

  //State
  passwordHide: boolean = true;
  isLogin: boolean = false;
  showReset: string = !this.isLogin ? 'hidden' : 'shown';
  showExtra: string = this.isLogin ? 'hidden' : 'shown';
  showLoader: string = 'hidden';
  showLoginRegister: string = 'shown';
  emailError: string = '';

  //validation
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  birthPlaceFormControl = new FormControl('', [Validators.required]);
  birthDateFormControl = new FormControl('', [Validators.required, Validators.pattern(DATE_REGEX)]);
  birthTimeFormControl = new FormControl('', [Validators.required]);

  //methods
  ngOnInit() {
    this.setLoginState(this.route.snapshot.queryParamMap.get('register') != '1');
    this.titleService.setTitle('Είσοδος / Εγγραφή');
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

  onSubmit() {
    if (this.isLogin && !this.hasValidationErrors([this.emailFormControl, this.passwordFormControl])) {

      this.showLoading(true);
      this.login(this.emailField, this.passwordField);

    } else if (!this.hasValidationErrors([this.emailFormControl, this.passwordFormControl,
      this.birthPlaceFormControl, this.birthDateFormControl, this.birthTimeFormControl])) {

      this.showLoading(true);
      this.authenticationService.register(this.emailField, this.passwordField,
        this.birthDateField, this.birthTimeField, this.birthPlaceField, this.typeField)
        .then((o) => {
          this.angulartics2.eventTrack('newUser', {});
          return this.login(this.emailField, this.passwordField)
        })
        .catch(error => this.handleError(error));
    }
  }

  sendResetEmail() {
    if (this.hasValidationErrors([this.emailFormControl])) {
      return;
    }

    const that = this;
    this.authenticationService.sendResetEmail(this.emailField)
      .then(function(allGood:boolean) {
        that.showErrorDialog('Προσοχή', 'Μόλις σου αποστείλαμε email για την αλλαγή του κωδικού σου.')
      })
      .catch(error => that.handleError(error));
  }

  login(username: string, password: string): Promise<any> {
    const that = this;
    return this.authenticationService.login(this.emailField, this.passwordField)
      .then(function(user: User) {
        return that.apollo.query({
          query: CurrentUser
        }).toPromise()
        .then(result => {
          const user: User = result.data['me'];
          return Promise.resolve(user.natalDates);
        });
      })
      .then(function(natalDates: Array<NatalDate>) {
        that.storageService.setNatalDates(natalDates);
        return natalDates.filter(function(natalDate) {
          return natalDate.primary;
        })[0];
      })
      .then(function(natalDate: NatalDate) {
        return that.router.navigate(['/daily/' + natalDate.name]);
      })
      .catch(error => that.handleError(error));
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
    var title: string = 'Προσοχή';
    var message: string;
    switch (response.status) {
      case 401:
        message = 'Το email ή ο κωδικός πρόσβασης δεν είναι σωστά!';
        break;
      case 400:
        var err = JSON.parse(response.error).error;
        
        if (err.name == 'ExternalServiceError' && err.type == 'timezone error') {
          message = 'Δεν βρέθηκε ο τόπος γέννησης, πάντα σύμφωνα με την google... :) ';
        } else if (err.name = 'ServiceError') {
          if (err.field == 'email') {//err.type == 'unique violation'
            message = 'To email αυτό έχει ήδη λογιαριασμό';
          } else if (err.field == 'birthDate') {//err.type == 'unique violation'
            message = 'Η ημερομηνία ή ώρα γεννησης έχει λάθος μορφή';
          } else {
            message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
          }
        }
        break;
      default:
        message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
    }
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