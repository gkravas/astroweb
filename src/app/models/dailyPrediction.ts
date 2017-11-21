export interface DailyPrediction {
    accuracy: Number;
    planetExplanations: [PlanetExplanations];
}

export interface PlanetExplanations {
    title: string;
    lemma: string;
}