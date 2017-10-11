import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'errorDialog',
    templateUrl: 'errorDialog.component.html',
    styleUrls: ['errorDialog.component.css']
  })
  export class ErrorDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ErrorDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  }