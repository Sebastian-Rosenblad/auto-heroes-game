import { getBaseHeroes } from "../apis/hero.api";
import { EntityNameE } from "../enums/entity-name.enum";
import { RarityE } from "../enums/rarity.enum";
import { BaseHeroM } from "../models/base-hero.model";
import { HeroM } from "../models/hero.model";
import { baseToHero } from "./hero.functions";

export function refreshTavern(heroes: Array<HeroM | undefined>, tavernLevel: number, fame: number): Array<HeroM> {
  const baseHeroes: Array<BaseHeroM> = getBaseHeroes();
  const rarities: Array<number> = baseHeroes.map(baseHero =>
    baseHero.rarity === RarityE.common ? 256 :
    (baseHero.rarity === RarityE.uncommon ? 4 : 1) * Math.pow(4, fame - 1)
  );
  const IDs: Array<string> = heroes.map(h => h?.id || "");
  let tavern: Array<HeroM> = [];
  const innkeeperLevels: number = heroes.filter((hero: HeroM | undefined): hero is HeroM => hero !== undefined && hero.base.name === EntityNameE.innkeeper).map(innkeeper => innkeeper.level).reduce((a, b) => a + b, 0);
  const bonusSlots: number = Math.floor(innkeeperLevels / 50) + Math.random() < (innkeeperLevels % 50) / 50 ? 1 : 0;
  for (let i = 0; i < tavernLevel + 3 + bonusSlots; i++) tavern.push(getRandomHero([...IDs, ...tavern.map(h => h.id)], baseHeroes, rarities));
  return tavern;
}
function getRandomHero(IDs: Array<string>, baseHeroes: Array<BaseHeroM>, rarities: Array<number>): HeroM {
  const totalRarity: number = rarities.reduce((a, b) => a + b, 0);
  let value: number = Math.random() * totalRarity;
  for (let i = 0; i < rarities.length; i++) {
    if (value <= rarities[i]) return baseToHero(baseHeroes[i], IDs);
    value -= rarities[i];
  }
  return baseToHero(baseHeroes[baseHeroes.length - 1], IDs);
}
