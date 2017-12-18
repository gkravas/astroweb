export interface DailyPrediction {
    accuracy: Number;
    planetExplanations: Array<PlanetExplanations>;
}

export interface PlanetExplanations {
    isAd: boolean;
    adIndex: number;
    title: string;
    lemma: string;
}