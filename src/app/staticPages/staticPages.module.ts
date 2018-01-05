import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { CommonComponentsModule } from "../common.components.module";
import { LandingPageComponent } from '../landingPage/landingPage.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'privacy', component: PrivacyComponent },
];
@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [
        TermsComponent,
        AboutComponent,
        PrivacyComponent,
        LandingPageComponent
    ],
    exports: [
        TermsComponent,
        AboutComponent,
        PrivacyComponent,
        LandingPageComponent
    ],
})
export class StaticPagesModule {}