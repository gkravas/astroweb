import { Input, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { AuthenticationService } from '../services/authentication.service';
import { AuthorizationService } from '../services/authorization.service';
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';
import { checkIfMatchingPasswords } from '../validators/matchingValidator';

@Component({
  selector: 'reset-password',
  templateUrl: 'resetPassword.component.html',
  styleUrls: ['resetPassword.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ height: '*', opacity: 1 })),
      state('hidden', style({ height: '0', opacity: 0, padding: 0, display: 'none' })),
      transition('shown => hidden', animate('400ms ease-in')),
      transition('hidden => shown', animate('400ms ease-out')),
    ])
  ]
})
export class ResetPasswordComponent {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService, 
    private authorizationService: AuthorizationService,
    private titleService: Title,
    public dialog: MatDialog,
    private fb: FormBuilder) {}

    showNatalOnly: boolean = true;
    changePasswordHide: boolean = true;
    changePasswordRepeatHide: boolean = true;
    formChangePassword: FormGroup;
    showLoader: string = 'hidden';

    //methods
    ngOnInit() {
      this.titleService.setTitle('Αλλαγή Κωδικού');
      this.authorizationService.setToken(this.route.snapshot.queryParamMap.get('t'));

      this.formChangePassword = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordRepeat: ['', [Validators.required, checkIfMatchingPasswords('password', 'passwordRepeat')]]
      });

      if (!this.authorizationService.isAuthenticated()) {
        this.showTokenExpiredDialog();
      }
      this.formChangePassword.get('email').patchValue(this.authorizationService.getPublicData().email);
    }

    showLoading(visible: boolean) {
      this.showLoader = visible ? 'shown' : 'hidden';
    }

    onSubmit() {
      if (!this.authorizationService.isAuthenticated()) {
        this.showTokenExpiredDialog();
        return;
      }

      this.formChangePassword.get('passwordRepeat').updateValueAndValidity();
      this.formChangePassword.get('passwordRepeat').markAsTouched();
      if (!this.formChangePassword.valid) {
        return;
      }
      
      const that = this;
      this.showLoading(true);
      this.authenticationService.resetPassword(this.formChangePassword.get('password').value)
        .subscribe(result => {
          that.showErrorDialog('Επιτυχία', 'Ο νεός σου κωδικός αποθηκεύτηκε επιτυχώς!')
            .afterClosed()
            .subscribe(result => {
              that.router.navigate(['/login']);
            });
        }, error => that.handleError(error));
    }

    showTokenExpiredDialog() {
      this.showErrorDialog('Προσοχή', 'Δυστυχώς περάσανε τα 30 λεπτά που' +
      ' είχες για να αλλάξεις τον κωδικό σου.\nΠήγαινε ξανά στο ξέχασα τον κωδικό μου.');
    }
    hasValidationErrors(controls: [FormControl]): boolean {
      for (var i = 0; i < controls.length; i++) {
        if (controls[i].errors != null) {
          return true;
        }
      }
      return false;
    }

    handleError(error: HttpErrorResponse) {
      console.error(error);
      var title: string = 'Προσοχή';
      var message: string = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
      this.showLoading(false);
      this.showErrorDialog(title, message);
    }

    showErrorDialog(title: string, message: string) {
      return this.dialog.open(ErrorDialogComponent, {
        width: '250px',
        data: { 
          title: title, 
          message: message,
          positive: 'OK'
        }
      });
    }
}