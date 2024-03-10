import { BaseHeroM } from "./base-hero.model";

export interface HeroM {
  id: string;
  level: number;
  experience: number;
  bonusAttack: number;
  bonusHealth: number;
  base: BaseHeroM;
}
