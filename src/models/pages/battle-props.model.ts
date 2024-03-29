import { BattleHeroM } from "../battle-hero.model";

export interface BattlePropsM {
  initialized: boolean;
  endGame: () => void;
  party: Array<BattleHeroM>;
  gold: number;
  lives: number;
  battles: number;
  seed: string;
  endBattle: (party: Array<BattleHeroM>, gold: number, lives: number) => void;
}
