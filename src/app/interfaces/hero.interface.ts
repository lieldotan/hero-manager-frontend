export interface Hero {
  id: number;
  name: string;
  suitColor: string;
  hasCape: boolean;
  lastMission: string;
  isRetired: boolean;
  powers: string[];
}

export type HeroCreateSchema = Omit<Hero, 'id'>;
