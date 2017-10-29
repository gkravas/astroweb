import { Injectable } from '@angular/core';
import { NatalDate } from '../models/natalDate';

@Injectable()
export class StorageService {

    private static NATAL_DATES: string = 'natalDates';
    private static TOKEN: string = 'token';

    public clear() {
        localStorage.clear();
    }
    public setNatalDates(natalDates: Array<NatalDate>) {
        return localStorage.setItem(StorageService.NATAL_DATES, JSON.stringify(natalDates));
    }

    public getNatalDates(): Array<NatalDate> {
        return JSON.parse(localStorage.getItem(StorageService.NATAL_DATES)) as Array<NatalDate>
    }

    public setToken(token: string) {
        return localStorage.setItem(StorageService.TOKEN, token);
    }

    public getToken(): string {
        return localStorage.getItem(StorageService.TOKEN) as string
    }
}