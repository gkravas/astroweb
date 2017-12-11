import { Injectable } from '@angular/core';
import { NatalDate } from '../models/natalDate';
import { User } from '../models/user';

@Injectable()
export class StorageService {

    private static NATAL_DATES: string = 'natalDates';
    private static TOKEN: string = 'token';
    private static USER: string = 'user';

    public clear() {
        localStorage.clear();
    }
    public setNatalDates(natalDates: Array<NatalDate>) {
        return localStorage.setItem(StorageService.NATAL_DATES, JSON.stringify(natalDates));
    }

    public getNatalDates(): Array<NatalDate> {
        const str: string = localStorage.getItem(StorageService.NATAL_DATES);
        if (!str) {
            return new Array<NatalDate>();
        } else {
            return JSON.parse(str) as Array<NatalDate>
        }
    }

    public setToken(token: string) {
        return localStorage.setItem(StorageService.TOKEN, token);
    }

    public getToken(): string {
        return localStorage.getItem(StorageService.TOKEN) as string
    }

    public setUser(user: User) {
        return localStorage.setItem(StorageService.USER, JSON.stringify(user));
    }

    public getUser(): User {
        return JSON.parse(localStorage.getItem(StorageService.USER)) as User;
    }
}