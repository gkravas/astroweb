import { Input, Component } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ApolloError } from 'apollo-client';
import * as moment from 'moment-timezone';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { AuthenticationService } from '../services/authentication.service';
import { AuthorizationService } from '../services/authorization.service';
import { StorageService } from '../services/storage.service';
import { NatalDatesService } from '../services/natalDates.service';
import { UserService } from '../services/user.service';
import { ErrorDialogComponent } from '../errorDialog/errorDialog.component';

import { User } from '../models/user';
import { NatalDate } from '../models/natalDate';
import { checkIfMatchingPasswords } from '../validators/matchingValidator';

interface Type {
  id: string;
  name: string;
}

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ height: '*', opacity: 1 })),
      state('hidden', style({ height: '0', opacity: 0, padding: 0, display: 'none' })),
      transition('shown => hidden', animate('400ms ease-in')),
      transition('hidden => shown', animate('400ms ease-out')),
    ])
  ]
})
export class ProfileComponent {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb : FormBuilder,
    private apollo: Apollo,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService, 
    private storageService: StorageService, 
    private natalDatesService: NatalDatesService,
    private userService: UserService,
    private titleService: Title,
    private dialog: MatDialog) {}

  types: Array<Type> = [
    {id: 'male', name: "Άνδρας"},
    {id: 'female', name: "Γυναίκα"},
    {id: 'freeSpirit', name: "Ελεύθερη Ψυχή"}
  ];

  @Input() title: string;

  currentEmail: string = '';

  showNatalDateLoader: string = 'hidden';
  showChangeEmailLoader: string = 'hidden';
  showChangePasswordLoader: string = 'hidden';
  showNatalOnly: boolean = true;
  changePasswordHide: boolean = true;
  changePasswordRepeatHide: boolean = true;

  formChangeEmail: FormGroup;
  formChangePassword: FormGroup;

  formNatalDate = new FormGroup({
    id:  new FormControl(''),
    name:  new FormControl(''),
    primary:  new FormControl(''),
    type:  new FormControl(''),
    livingPlace: new FormControl('', [Validators.required]),
    birthPlace: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    birthTime: new FormControl('', [Validators.required])
  });
  
  checkOldEmail() {
    return (ac: AbstractControl) => {
      try {
        if (ac.value == this.storageService.getUser().email) {
          return {'oldEmail': true};
        } else {
          return null;
        }
      } catch(err) {
        return null;
      }
    }
  }

  ngOnInit() {
    this.titleService.setTitle("Ο Λογαριασμός μου");
    this.title = this.titleService.getTitle();
    
    this.formChangePassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required, checkIfMatchingPasswords('password', 'passwordRepeat')]]
    });

    this.formChangeEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.checkOldEmail()]]
    });

    const that = this;
    that.natalDatesService.getAll()
    .flatMap((natalDates: Array<NatalDate>) => {
      var me = natalDates.length > 0 
        ? natalDates[0]
        : {id: 0, name: 'me', location: null, date: null, type: null, primary: true};
      return of(me);
    })
    .subscribe((me: NatalDate) => {
      this.showNatalOnly = me.id == 0;
      this.formNatalDate.patchValue({id: me.id});
      this.formNatalDate.patchValue({birthPlace: me.location});
      this.formNatalDate.patchValue({type: me.type});
      this.formNatalDate.patchValue({name: me.name});
      if (me.date) {
        const dateMoment = moment(new Date(me.date).toISOString()).utcOffset(me.timezoneMinutesDifference / 60);
        this.formNatalDate.patchValue({birthDate: dateMoment.format('YYYY-MM-DD')});
        this.formNatalDate.patchValue({birthTime: dateMoment.format('HH:mm')});
      } else {
        this.formNatalDate.patchValue({birthTime: '12:00'});
      }
      //this is here because for each natal date fetch we fetch user's info too
      this.formNatalDate.patchValue({livingPlace: this.storageService.getUser().location});
      this.formChangeEmail.patchValue({email: this.storageService.getUser().email});
    });
  }

  showNatalDateLoading(visible: boolean) {
    this.showNatalDateLoader = visible ? 'shown' : 'hidden';
  }

  showChangeEmailLoading(visible: boolean) {
    this.showChangeEmailLoader = visible ? 'shown' : 'hidden';
  }

  showChangePasswordLoading(visible: boolean) {
    this.showChangePasswordLoader = visible ? 'shown' : 'hidden';
  }

  onChangeEmailSubmit() {
    if (!this.formChangeEmail.valid) {
      return;
    }
    const email: string = this.formChangeEmail.get('email').value;
    const that = this;
    this.showChangeEmailLoading(false);
    this.authenticationService.changeEmail(email)
      .subscribe(result => {
        const user = that.storageService.getUser();
        user.email = email;
        that.storageService.setUser(user);
        that.showDialog('Επιτυχία', 'Το νέο σου email αποθηκεύτηκε με επιτυχία');
      }, (response: HttpErrorResponse) => {
        console.error(response);
        var title: string = 'Προσοχή';
        var message: string;
        switch (response.status) {
          case 400:
            var err = response.error.error;

            if (err.name = 'ServiceError') {
              if (err.field == 'email') {//err.type == 'unique violation'
                switch(err.type) {
    
                  case 'unique violation':
                    message = 'To email αυτό έχει ήδη λογιαριασμό';
                  break;
    
                  case 'notNull violation':
                    message = 'Δεν μας έγραψες τo email σου';
                  break;
                }
              }
            }
            break;
        }
        if (!message) {
          message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
        }
        that.showChangeEmailLoading(false);
        that.showDialog(title, message);
      });
  }

  onChangePasswordSubmit() {
    this.formChangePassword.get('passwordRepeat').updateValueAndValidity();
    this.formChangePassword.get('passwordRepeat').markAsTouched();
    if (!this.formChangePassword.valid) {
      return;
    }

    const that = this;
    const password: string = this.formChangePassword.get('password').value;
    this.showChangePasswordLoading(true);
    this.authenticationService.resetPassword(password)
      .subscribe(result => {
        this.showChangePasswordLoading(false);
        that.showDialog('Επιτυχία', 'Ο νεός σου κωδικός αποθηκεύτηκε επιτυχώς!')
      }, (response: HttpErrorResponse) => {
        var title: string = 'Προσοχή';
        var message: string = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
        this.showChangePasswordLoading(false);
        this.showDialog(title, message);
      });
  }

  onNatalDateFormSubmit() {
    if (!this.formNatalDate.valid) {
      return;
    }
    const that = this;
    this.showNatalDateLoading(true);
    this.userService.updateUser(this.formNatalDate.get('livingPlace').value)
      .subscribe((user: User) => {
        that.updateNatalDate();
      }, (apolloError: ApolloError) => {
        const error: any = apolloError.graphQLErrors[0]
        var title: string = 'Προσοχή';
        var message: string;
        if (error.name == 'ExternalServiceError' && error.type == 'timezone error') {
          message = 'Δεν βρέθηκε ο τόπος κατοικίας σου, πάντα σύμφωνα με την google... :) ';
        } else {
            message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
        }
        this.showNatalDateLoading(false);
        this.showDialog(title, message);
      })
  }

  updateNatalDate() {
    const fields = this.formNatalDate.value;
    const date = fields['birthDate'] + "T" + fields['birthTime'] + ':00';
    const action = fields['id'] == 0
                      ?
      this.natalDatesService.createNatalDate(date, fields['name'], 
                      fields['birthPlace'], fields['primary'], fields['type'])
                      :
      this.natalDatesService.updateNatalDate(fields['id'], date, fields['name'], 
                      fields['birthPlace'], fields['primary'], fields['type']);

    const that = this;
    action
      .subscribe(result => {
        var natalDates: Array<NatalDate> =  that.storageService.getNatalDates();
        natalDates.pop();
        natalDates.push(result);
        that.storageService.setNatalDates(natalDates);
        this.showNatalDateLoading(false);
        that.showDialog('Επιτυχία', 'Τα στοιχεία σου αποθηκεύτηκαν με επιτυχία')
        .afterClosed()
        .subscribe(result => {
          this.router.navigate(['/daily/me']);
        });
      }, (apolloError: ApolloError) => {
        const error: any = apolloError.graphQLErrors[0]
        var title: string = 'Προσοχή';
        var message: string;
        if (error.name == 'ExternalServiceError' && error.type == 'timezone error') {
          message = 'Δεν βρέθηκε ο τόπος γέννησης σου, πάντα σύμφωνα με την google... :) ';
        } else if (error.name = 'ServiceError') {
          if (error.field == 'birthDate') {
            message = 'Η ημερομηνία ή ώρα γεννησης έχει λάθος μορφή';
          } else {
            message = 'Υπήρξε κάποιο πρόβλημα επικοινωνίας με τον ψηφιακό αστρολόγο... Δοκίμασε πάλι σε λιγάκι!';
          }
        }
        this.showNatalDateLoading(false);
        this.showDialog(title, message);
      });
  }

  showDialog(title: string, message: string) {
    return this.dialog.open(ErrorDialogComponent, {
      width: '250px',
      data: { 
        title: title, 
        message: message,
        positive: 'OK'
       }
    });
  }

  formatTimeZoneOffset(offset: number) {
    const isPositive = offset > 0;
    offset = Math.abs(offset);
    return (isPositive ? '+' : '-') + this.pad2(offset / 3600) + '' + this.pad2(offset % 3600);
  }

  pad2(number) {
    return (number < 10 ? '0' : '') + number
  }
}