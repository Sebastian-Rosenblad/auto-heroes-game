import { hero_db, summons_db } from "../databases/hero.db";
import { EntityNameE } from "../enums/entity-name.enum";
import { RarityE } from "../enums/rarity.enum";
import { toCamelCase } from "../functions/utils";
import { AbilityM, BaseHeroM } from "../models/base-hero.model";

let baseHeroes: Array<BaseHeroM> = [];
let baseSummons: Array<BaseHeroM> = [];
export function getBaseHeroes(): Array<BaseHeroM> {
  if (baseHeroes.length === 0) baseHeroes = hero_db.map(stringToBaseHero);
  return baseHeroes;
}
export function getBaseSummons(): Array<BaseHeroM> {
  if (baseSummons.length === 0) baseSummons = summons_db.map(stringToBaseHero);
  return baseSummons;
}
export function getSummon(name: EntityNameE): BaseHeroM {
  if (baseSummons.length === 0) baseSummons = summons_db.map(stringToBaseHero);
  return baseSummons.find(summon => summon.name === name) || baseSummons[0];
}
function stringToBaseHero(line: string): BaseHeroM {
  const parts: Array<string> = line.split(";");
  return {
    name: parts[0] as EntityNameE,
    ability: linesToAbilities(parts.slice(4)),
    image: toCamelCase(parts[0]),
    rarity: charToRarity(parts[1]),
    attack: parseInt(parts[2]),
    health: parseInt(parts[3])
  };
}
function linesToAbilities(lines: Array<string>): Array<AbilityM> {
  return lines.map(line => {
    const parts: Array<string> = line.split(":");
    if (parts[0].length === 0) return { text: parts[1] };
    return { title: parts[0], text: parts[1] };
  });
}
function charToRarity(char: string): RarityE {
  switch (char) {
    case "c": return RarityE.common;
    case "u": return RarityE.uncommon;
    case "r": return RarityE.rare;
    default: return RarityE.summon;
  }
}
