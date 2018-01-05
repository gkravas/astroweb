import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { CommonComponentsModule } from "../common.components.module";
import { DailyPredictionComponent } from './dailyPrediction.component';
import { DailyPredictionAdSenseComponent } from '../adSense/dailyPredictionAdSense.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', component: DailyPredictionComponent },
];
@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [
        DailyPredictionComponent,
        DailyPredictionAdSenseComponent
    ],
    exports: [
        DailyPredictionComponent,
        DailyPredictionAdSenseComponent
    ],
})
export class DailyPredictionModule {}