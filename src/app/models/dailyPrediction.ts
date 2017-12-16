export interface DailyPrediction {
    accuracy: Number;
    planetExplanations: Array<PlanetExplanations>;
}

export interface PlanetExplanations {
    title: string;
    lemma: string;
}