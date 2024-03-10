import { EntityNameE } from "../enums/entity-name.enum";
import { RarityE } from "../enums/rarity.enum";

export interface BattleHeroM {
  id: string;
  name: EntityNameE;
  image: string;
  rarity: RarityE;
  level: number;
  experience: number;
  baseAttack: number;
  baseHealth: number;
  bonusAttack: number;
  bonusHealth: number;
  temporaryAttack: number;
  temporaryHealth: number;
  poisonous: boolean;
  shield: number;
  firstStrike: number;
  poison: number;
}
