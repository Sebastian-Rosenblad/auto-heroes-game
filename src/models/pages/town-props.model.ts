import { HeroM } from "../hero.model";

export interface TownPropsM {
  heroes: Array<HeroM | undefined>;
  updateHeroes: (newHeroes: Array<HeroM | undefined>) => void;
  gold: number;
  updateGold: (newGold: number) => void;
  fame: number;
  tavernLevel: number;
  updateTavernLevel: (newTavernLevel: number) => void;
}
