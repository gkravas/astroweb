import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { CommonComponentsModule } from "../common.components.module";
import { LoginRegisterComponent } from './loginRegister.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: LoginRegisterComponent },
];
@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [
        LoginRegisterComponent
    ],
    exports: [
        LoginRegisterComponent
    ],
})
export class LoginRegisterModule {}