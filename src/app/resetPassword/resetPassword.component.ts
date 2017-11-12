import { Input, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
    public dialog: MatDialog) {}

    //form fiels
    emailField: string = "";
    passwordField: string = "";

    //State
    passwordHide = true;
    showLoader: string = 'hidden';

    //validation
    passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

    //methods
    ngOnInit() {
      this.titleService.setTitle('Αλλαγή Κωδικού');
      this.authorizationService.setToken(this.route.snapshot.queryParamMap.get('t'));
      if (!this.authorizationService.isAuthenticated()) {
        this.showTokenExpiredDialog();
      }
      this.emailField = this.authorizationService.getPublicData().email;
    }

    showLoading(visible: boolean) {
      this.showLoader = visible ? 'shown' : 'hidden';
    }

    onSubmit() {
      if (!this.authorizationService.isAuthenticated()) {
        this.showTokenExpiredDialog();
        return;
      }

      if (this.hasValidationErrors([this.passwordFormControl])) {
        return;
      }
      
      const that = this;
      this.showLoading(true);
      return this.authenticationService.resetPassword(this.passwordField)
        .then(function(allGood:any) {
          that.showErrorDialog('Επιτυχία', 'Ο νεός σου κωδικός αποθηκεύτηκε επιτυχώς!')
            .afterClosed()
            .subscribe(result => {
              that.router.navigate(['/login']);
            });
        })
        .catch(error => that.handleError(error));
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