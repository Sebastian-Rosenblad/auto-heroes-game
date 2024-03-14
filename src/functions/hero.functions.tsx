import { HeroM } from "../models/hero.model";
import { BattleHeroM } from "../models/battle-hero.model";
import { EntityNameE } from "../enums/entity-name.enum";
import { BaseHeroM } from "../models/base-hero.model";
import { getID } from "./utils";

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
export function getHeroToolTipText(hero: HeroM): JSX.Element {
  return <div className="tooltip">
    <p><b>{hero.base.name}</b></p>
    {hero.base.ability.map((ability, i) => <p key={hero.id + "-tooltip-" + i}>{ability.title && <i>{ability.title} - </i>}{abilityHeroText(ability.text, hero)}</p>)}
  </div>;
}
function abilityHeroText(text: string, hero: HeroM): string {
  let newText: string = text
    .split("[LEVEL]").join(hero.level.toString())
    .split("[LEVEL*2]").join((hero.level * 2).toString())
    .split("[LEVEL*25]").join((hero.level * 25).toString())
    .split("[LEVEL/3]").join(Math.round(hero.level * 100 / 3).toString())
    .split("[ATTACK]").join((hero.base.attack * hero.level + hero.bonusAttack).toString())
    .split("[HEALTH/2]").join(Math.round((hero.base.health * hero.level + hero.bonusHealth)/2).toString());
  const pluralRegex = /\[PLURAL¨(.*?)¨(.*?)\]/g;
  newText = newText.replace(pluralRegex, (match, singular, plural) => {
    return hero.level === 1 ? singular : plural;
  });
  const pluralSimpleRegex = /\[PLURAL¨¨(.*?)\]/g;
  newText = newText.replace(pluralSimpleRegex, (match, append) => {
    return hero.level === 1 ? '' : append;
  });
  return newText;
}
