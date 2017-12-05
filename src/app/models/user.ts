import { NatalDate } from '../models/natalDate';

export class User {
    id: number;
    email: string;
    accountComplete: boolean;
    natalDates: [NatalDate];
}