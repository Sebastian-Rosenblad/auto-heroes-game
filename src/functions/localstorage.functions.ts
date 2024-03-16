import { HeroM } from "../models/hero.model";
import { LocalStorageM } from "../models/localstorage.model";
import { EntityNameE } from "../enums/entity-name.enum";
import { getBaseHero } from "../apis/hero.api";

const KEY: string = "AutoHeroesGame";

export function loadSavedGame(): LocalStorageM | undefined {
  const storage: string | null = localStorage.getItem(KEY);
  if (storage !== null) {
    const parts: Array<string> = storage.split(";");
    return {
      heroes: parts[0].split(":").map(parseHero),
      tavern: parts[1].split(":").map(parseBaseHero),
      lives: parseInt(parts[2]),
      gold: parseInt(parts[3]),
      fame: parseInt(parts[4]),
      tavernLevel: parseInt(parts[5]),
      seed: parts[6]
    };
  }
  return undefined;
}
export function saveGame(data: LocalStorageM) {
  localStorage.setItem(KEY, [data.heroes.map(stringifyHero).join(":"), data.tavern.map(hero => hero.id + "," + hero.base.name).join(":"), data.lives, data.gold, data.fame, data.tavernLevel, data.seed].join(";"));
}
function stringifyHero(hero: HeroM | undefined): string {
  if (hero === undefined) return "";
  return [hero.id, hero.level, hero.experience, hero.bonusAttack, hero.bonusHealth, hero.base.name].join(",");
}
function parseHero(text: string): HeroM | undefined {
  if (text.length === 0) return undefined;
  const parts: Array<string> = text.split(",");
  return {
    id: parts[0],
    level: parseInt(parts[1]),
    experience: parseInt(parts[2]),
    bonusAttack: parseInt(parts[3]),
    bonusHealth: parseInt(parts[4]),
    base: getBaseHero(parts[5] as EntityNameE)
  };
}
function parseBaseHero(text: string): HeroM {
  const parts: Array<string> = text.split(",");
  return {
    id: parts[0],
    level: 1,
    experience: 0,
    bonusAttack: 0,
    bonusHealth: 0,
    base: getBaseHero(parts[1] as EntityNameE)
  };
}
