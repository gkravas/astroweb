import { Injectable } from '@angular/core';

export type GtmData = {[key: string]: any};

@Injectable()
export class GtmService {
    constructor() {
        // Make sure the dataLayer property exists on the window object,
        // or we will not be able to communicate with GTM.
        if (! Object.hasOwnProperty.call(window, 'dataLayer')) {
            throw new Error('`window.dataLayer` is not defined.');
        }
    }

    public push(data: GtmData) {
        window['dataLayer'].push(data);
    }

    public trigger(event: string, data?: GtmData) {
        this.push({
            event,
            ...data
        });
    }
}