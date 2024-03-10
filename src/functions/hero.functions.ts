import { HeroM } from "../models/hero.model";
import { BattleHeroM } from "../models/battle-hero.model";
import { EntityNameE } from "../enums/entity-name.enum";
import { BaseHeroM } from "../models/base-hero.model";

function getID(IDs: Array<string>): string {
  let ID: string = Math.random().toString(16).slice(2,8);
  while (IDs.includes(ID)) ID = Math.random().toString(16).slice(2,8);
  return ID;
}

export function baseToHero(base: BaseHeroM, IDs: Array<string>): HeroM {
  return {
    id: getID(IDs),
    level: 1,
    experience: 0,
    bonusAttack: 0,
    bonusHealth: 0,
    base: base
  };
}
export function heroToBattle(hero: HeroM): BattleHeroM {
  return {
    id: hero.id,
    name: hero.base.name,
    image: hero.base.image,
    rarity: hero.base.rarity,
    level: hero.level,
    experience: hero.experience,
    baseAttack: hero.base.attack * hero.level,
    baseHealth: hero.base.health * hero.level,
    bonusAttack: hero.bonusAttack,
    bonusHealth: hero.bonusHealth,
    temporaryAttack: 0,
    temporaryHealth: 0,
    poisonous: getPoisonous(hero.base.name),
    shield: getShield(hero.base.name, hero.level),
    firstStrike: getFirstStrike(hero.base.name, hero.level),
    poison: 0
  };
}
function getPoisonous(name: EntityNameE): boolean {
  if (name === EntityNameE.poisonousRat) return true;
  if (name === EntityNameE.spiderling) return true;
  if (name === EntityNameE.greenImp) return true;
  return false;
}
function getShield(name: EntityNameE, level: number): number {
  if (name === EntityNameE.blueImp) return level;
  return 0;
}
function getFirstStrike(name: EntityNameE, level: number): number {
  if (name === EntityNameE.archer) return level;
  if (name === EntityNameE.redImp) return 1;
  return 0;
}
