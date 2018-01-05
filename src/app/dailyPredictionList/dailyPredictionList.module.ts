import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { CommonComponentsModule } from "../common.components.module";
import { DailyPredictionListComponent } from './dailyPredictionList.component';
import { DailyPredictionListAdSenseComponent } from '../adSense/dailyPredictionListAdSense.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: DailyPredictionListComponent },
];
@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [
        DailyPredictionListComponent,
        DailyPredictionListAdSenseComponent
    ],
    exports: [
        DailyPredictionListComponent,
        DailyPredictionListAdSenseComponent
    ],
})
export class DailyPredictionListModule {}