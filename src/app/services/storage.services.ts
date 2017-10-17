import { Injectable } from '@angular/core';
import { NatalDate } from '../models/natalDate';

@Injectable()
export class StorageService {

    public setNatalDates(natalDates: Array<NatalDate>) {
        return localStorage.setItem('natalDates', JSON.stringify(natalDates));
    }

    public setToken(token: string): Array<NatalDate> {
        return JSON.parse(localStorage.getItem('natalDates')) as Array<NatalDate>
    }
}