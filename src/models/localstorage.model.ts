import { HeroM } from "./hero.model";

export interface LocalStorageM {
  heroes: Array<HeroM | undefined>;
  tavern: Array<HeroM>;
  gold: number;
  fame: number;
  tavernLevel: number;
}
