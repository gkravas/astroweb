import {Input, Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent} from '@angular/material';

import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { AuthenticationService } from '../services/authentication.service';
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DATE_REGEX = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

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

  constructor(private authenticationService: AuthenticationService, public dialog: MatDialog) { }

  //form fiels
  emailField: string = "";
  passwordField: string = "";
  birthPlaceField: string = "";
  birthDateField: string = "";
  birthTimeField: string = "";
  typeField: string = "";

  //State
  passwordHide = true;
  isLogin = false;
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
  onToggleState () {
      this.isLogin = !this.isLogin;
      this.showExtra = this.isLogin ? 'hidden' : 'shown';
  }

  showLoading(visible: boolean) {
    this.showLoader = visible ? 'shown' : 'hidden';
    this.showLoginRegister = !visible ? 'shown' : 'hidden';
  }

  onSubmit() {
    if (this.isLogin && !this.hasValidationErrors([this.emailFormControl, this.passwordFormControl])) {

      this.showLoading(true);
      this.authenticationService.login(this.emailField, this.passwordField)
        .then(user => console.log(user))
        .catch(error => this.handleError(error));

    } else if (!this.hasValidationErrors([this.emailFormControl, this.passwordFormControl,
      this.birthPlaceFormControl, this.birthDateFormControl, this.birthTimeFormControl])) {

      this.showLoading(true);
      this.authenticationService.register(this.emailField, this.passwordField,
        this.birthDateField, this.birthTimeField, this.birthPlaceField, this.typeField)
        .then(user => console.log(user))
        .catch(error => this.handleError(error));

    }
  }

  hasValidationErrors(controls: [FormControl]): boolean {
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].errors != null) {
        return true;
      }
    }
    return false;
  }

  handleError(error) {
    var title: string = 'Προσοχή';
    var message: string;
    switch (error.status) {
      case 401:
        message = 'Το email ή ο κωδικός πρόσβασης δεν ειναι σωστα!';
        break;
      case 400:
        const err = error.json().errors[0];
        if (err.type == 'timezone error' || err.path == 'location') {
          message = 'Δεν βρέθηκε ο τόπος γέννησης, παντα σύμφωνα με την google... :) ';
        } else if (err.path == 'email') {//err.type == 'unique violation'
          message = 'To email αυτό έχει ήδη λογιαριασμό';
        } else if (err.path == 'date') {//err.type == 'unique violation'
          message = 'Η ημερόμηνια ή ώρα γεννησης έχει λάθος μορφή';
        } else {
          message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκιμάστε πάλι σε λιγάκι!';
        }
        break;
      default:
        message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκιμάστε πάλι σε λιγάκι!';
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