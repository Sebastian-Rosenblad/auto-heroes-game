import { EntityNameE } from "../enums/entity-name.enum";
import { RarityE } from "../enums/rarity.enum";

export interface BaseHeroM {
  name: EntityNameE;
  ability: Array<AbilityM>;
  image: string;
  rarity: RarityE;
  attack: number;
  health: number;
}
export interface AbilityM {
  title?: string;
  text: string;
}
