export interface NatalDate {
    id: number;
    name: string;
    date: string;
    location: string;
    coordinates: Coordinates;
    timezoneMinutesDifference: number;
    type: string;
    primary: boolean;
}

export interface Coordinates {
    lat: number;
    lng: string;
}