import { NatalDate } from '../models/natalDate';

export class User {
    id: number;
    email: string;
    location: string;
    natalDates: [NatalDate];
}