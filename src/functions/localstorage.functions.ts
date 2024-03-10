import { getBaseHeroes } from "../apis/hero.api";
import { BaseHeroM } from "../models/base-hero.model";
import { HeroM } from "../models/hero.model";
import { LocalStorageM } from "../models/localstorage.model";

const KEY: string = "AutoHeroesGame";

export const hasSavedGame = (): boolean => localStorage.getItem(KEY) !== null;
export function loadSavedGame(): LocalStorageM {
  const storage: string | null = localStorage.getItem(KEY);
  if (storage !== null) {
    const parts: Array<string> = storage.split(";");
    return {
      heroes: parts[0].split(":").map(parseHero),
      tavern: parts[1].split(":").map(parseBaseHero),
      gold: parseInt(parts[2]),
      fame: parseInt(parts[3]),
      tavernLevel: parseInt(parts[4])
    };
  }
  return {
    heroes: new Array(10).fill(undefined),
    tavern: [],
    gold: 11,
    fame: 1,
    tavernLevel: 1
  };
}
export function saveGame(data: LocalStorageM) {
  localStorage.setItem(KEY, [data.heroes.map(stringifyHero).join(":"), data.tavern.map(hero => hero.base.name + "," + hero.id).join(":"), data.gold, data.fame, data.tavernLevel].join(";"));
}
function stringifyHero(hero: HeroM | undefined): string {
  if (hero === undefined) return "";
  return [hero.id, hero.level, hero.experience, hero.bonusAttack, hero.bonusHealth, hero.base.name].join(",");
}
function parseHero(text: string): HeroM | undefined {
  if (text.length === 0) return undefined;
  const baseHeroes: Array<BaseHeroM> = getBaseHeroes();
  const parts: Array<string> = text.split(",");
  return {
    id: parts[0],
    level: parseInt(parts[1]),
    experience: parseInt(parts[2]),
    bonusAttack: parseInt(parts[3]),
    bonusHealth: parseInt(parts[4]),
    base: baseHeroes.find(baseHero => baseHero.name === parts[5]) || baseHeroes[0]
  };
}
function parseBaseHero(text: string): HeroM {
  const baseHeroes: Array<BaseHeroM> = getBaseHeroes();
  const parts: Array<string> = text.split(",");
  return {
    id: parts[1],
    level: 1,
    experience: 0,
    bonusAttack: 0,
    bonusHealth: 0,
    base: baseHeroes.find(baseHero => baseHero.name === parts[0]) || baseHeroes[0]
  };
}
