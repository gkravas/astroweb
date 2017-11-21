import { NgModule } from '@angular/core';
import {MatButtonModule, MatInputModule, MatDatepickerModule,
  MatNativeDateModule, MatFormFieldModule, MatSelectModule, 
  MatCardModule, MatIconModule, MatSlideToggleModule,
  MatDialogModule, MatProgressBarModule, MatToolbarModule,
  MatGridListModule, MatProgressSpinnerModule, MatSliderModule,
  MatSnackBarModule } from '@angular/material';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MAT_DATE_LOCALE,
  MAT_DATE_LOCALE_PROVIDER,
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatDatepickerModule, 
    MatNativeDateModule, MatFormFieldModule, MatSelectModule, 
    MatCardModule, MatIconModule, MatSlideToggleModule,
    MatDialogModule, MatProgressBarModule, MatToolbarModule,
    MatGridListModule, MatProgressSpinnerModule, MatSliderModule,
    MatSnackBarModule,

    FormsModule, ReactiveFormsModule
  ],
  exports: [MatButtonModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatFormFieldModule, MatSelectModule,
    MatCardModule, MatIconModule, MatSlideToggleModule,
    MatDialogModule, MatProgressBarModule, MatToolbarModule,
    MatGridListModule, MatProgressSpinnerModule, MatSliderModule,
    MatSnackBarModule,

    FormsModule, ReactiveFormsModule
  ],

  providers: [
    MAT_DATE_LOCALE_PROVIDER,
    {provide: MAT_DATE_LOCALE, useValue: 'el-GR'},
  ]
})
export class MaterialModule { }