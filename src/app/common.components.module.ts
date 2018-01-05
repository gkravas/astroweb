import { NgModule } from '@angular/core';

import { BasePageComponent } from './basePage/basePage.component';
import { FooterLandingComponent } from './footerLanding/footerLanding.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FacebookModule } from 'ngx-facebook';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FacebookModule,
        RouterModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        BasePageComponent,
        FooterLandingComponent,
        FooterComponent,
        HeaderComponent
    ],
    exports: [
        BasePageComponent,
        FooterLandingComponent,
        FooterComponent,
        HeaderComponent,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
})
export class CommonComponentsModule {}