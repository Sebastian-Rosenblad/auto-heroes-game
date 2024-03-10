import { HeroM } from "../hero.model";

export interface TownPropsM {
  initialized: boolean;
  endGame: () => void;
  heroes: Array<HeroM | undefined>;
  updateHeroes: (newHeroes: Array<HeroM | undefined>) => void;
  gold: number;
  updateGold: (newGold: number) => void;
  fame: number;
  tavern: Array<HeroM>;
  updateTavern: (newTavern: Array<HeroM>) => void;
  refreshTavern: () => void;
  tavernLevel: number;
  updateTavernLevel: (newTavernLevel: number) => void;
}
