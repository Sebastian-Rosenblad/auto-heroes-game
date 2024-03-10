import React, { useEffect, useState } from "react";
import './TownP.scss';
import { TownPropsM } from "../../models/pages/town-props.model";
import { HeroM } from "../../models/hero.model";
import { HeroC } from "../../components/Hero/HeroC";
import { baseToHero, heroToBattle } from "../../functions/hero.functions";
import { BaseHeroM } from "../../models/base-hero.model";
import { getBaseHeroes } from "../../apis/hero.api";
import { RarityE } from "../../enums/rarity.enum";
import { EntityNameE } from "../../enums/entity-name.enum";

export function TownP(props: TownPropsM): JSX.Element {
  const [heroes, setHeroes] = useState<Array<HeroM | undefined>>(props.heroes);
  const [tavern, setTavern] = useState<Array<HeroM>>([]);
  const [buying, setBuying] = useState<HeroM | undefined>(undefined);
  const [moving, setMoving] = useState<number | undefined>(undefined);
  const baseHeroes: Array<BaseHeroM> = getBaseHeroes();
  const rarities: Array<number> = baseHeroes.map(baseHero =>
    baseHero.rarity === RarityE.common ? 256 :
    (baseHero.rarity === RarityE.uncommon ? 4 : 1) * Math.pow(4, props.fame - 1)
  );
  const totalRarity: number = rarities.reduce((a, b) => a + b, 0);
  const tavernUpgradeMultiplier: number = 8;
  const tavernMaxLevel: number = 3;
  const tavernRefreshCost: number = 1;

  useEffect(() => refreshTavern(), []);

  function refreshTavern() {
    const IDs: Array<string> = heroes.map(h => h?.id || "");
    let newTavern: Array<HeroM> = [];
    for (let i = 0; i < props.tavernLevel + 3; i++) newTavern.push(getRandomHero([...IDs, ...newTavern.map(h => h.id)]));
    setTavern(newTavern);
  }
  function getRandomHero(IDs: Array<string>): HeroM {
    let value: number = Math.random() * totalRarity;
    for (let i = 0; i < rarities.length; i++) {
      if (value <= rarities[i]) return baseToHero(baseHeroes[i], IDs);
      value -= rarities[i];
    }
    return baseToHero(baseHeroes[baseHeroes.length - 1], IDs);
  }

  function handleTavernStartDrag(hero: HeroM) {
    setBuying(hero);
    setMoving(undefined);
  }
  function handleHeroStartDrag(index: number) {
    setMoving(index);
    setBuying(undefined);
  }
  function handleDropOverHero(index: number) {
    if (buying !== undefined && props.gold >= 3) {
      if (heroes[index] === undefined) {
        setHeroes([...heroes.map((hero, i) => index === i ? buying : hero)]);
        setTavern([...tavern.filter(hero => hero.id !== buying.id)]);
        props.updateGold(props.gold - 3);
      }
      else buyMergeHero(index);
    }
    else if (moving !== undefined) {
      const fromHero: HeroM | undefined = heroes[moving];
      const toHero: HeroM | undefined = heroes[index];
      if (fromHero !== undefined && toHero !== undefined && fromHero.base.name === toHero.base.name) {
        setHeroes([...heroes.map((hero, i) => i === index ? mergeHero(toHero, fromHero) : i === moving ? undefined : hero)]);
      }
      else setHeroes([...heroes.map((hero, i) => i === index ? fromHero : i === moving ? toHero : hero)]);
    }
  }
  function buyMergeHero(index: number) {
    const hero: HeroM | undefined = heroes[index];
    if (hero !== undefined && buying !== undefined) {
      setHeroes([...heroes.map((h, i) => index === i ? mergeHero(hero, buying) : h)]);
      setTavern([...tavern.filter(h => h.id !== buying.id)]);
      props.updateGold(props.gold - 3)
    }
  }
  function mergeHero(a: HeroM, b: HeroM): HeroM {
    const expGain: number = (b.level * (b.level + 1)) * 2.5 + b.experience;
    const didLevelUp: boolean = a.experience + expGain >= (a.level + 1) * 5;
    const expRest: number = didLevelUp ? a.experience + expGain - (a.level + 1) * 5 : a.experience + expGain;
    return {
      id: a.id,
      level: a.level + (didLevelUp ? 1 : 0),
      experience: expRest,
      bonusAttack: a.bonusAttack + b.bonusAttack,
      bonusHealth: a.bonusHealth + b.bonusHealth,
      base: a.base
    }
  }
  function handleTavernLevelClick() {
    props.updateTavernLevel(props.tavernLevel + 1);
    props.updateGold(props.gold - props.tavernLevel * tavernUpgradeMultiplier);
    setTavern([...tavern, getRandomHero([...heroes.map(hero => hero?.id || ""), ...tavern.map(hero => hero.id)])]);
  }
  function handleTavernRefreshClick() {
    props.updateGold(props.gold - tavernRefreshCost);
    refreshTavern();
  }

  return <div className="town">
    <div className="town--banner">
      <div className="town--banner--item">
        <h2>Gold: {props.gold}</h2>
      </div>
      <div className="town--banner--item">
        <h2>Fame: {props.fame}</h2>
        <p>You gain fame by going into battle. Higher fame increase the chances of uncommon and rare heroes appearing in the tavern.</p>
      </div>
    </div>
    <div className="town--field">
      <div className="town--field--info">
        <h2>Field</h2>
        <p>These are the heroes you bring into battle.</p>
      </div>
      <div className="town--field--slots">
        {heroes.slice(0, 6).map((hero, index) => hero === undefined ?
          <div
            key={"empty-hero-" + index}
            className="town--slot--empty"
            onDragOver={(evt) => evt.preventDefault()}
            onDrop={() => handleDropOverHero(index)}
          ></div> :
          <div
            key={hero.id + "-" + index}
            className="town--slot"
            draggable
            onDragStart={() => handleHeroStartDrag(index)}
            onDragOver={(evt) => evt.preventDefault()}
            onDrop={() => handleDropOverHero(index)}
          >
            <HeroC hero={heroToBattle(hero)}/>
          </div>
        )}
      </div>
    </div>
    <div className="town--bench">
      <div className="town--field--info">
        <h2>Bench</h2>
        <p>These are heroes you've hired but wont bring into battle.</p>
      </div>
      <div className="town--field--slots">
        {heroes.slice(6).map((hero, index) => hero === undefined ?
          <div
          key={"empty-hero-" + index}
          className="town--slot--empty"
          onDragOver={(evt) => evt.preventDefault()}
          onDrop={() => handleDropOverHero(index + 6)}
        ></div> :
        <div
          key={hero.id + "-" + index}
          className="town--slot"
          draggable
          onDragStart={() => handleHeroStartDrag(index + 6)}
          onDragOver={(evt) => evt.preventDefault()}
          onDrop={() => handleDropOverHero(index + 6)}
        >
          <HeroC hero={heroToBattle(hero)}/>
        </div>
        )}
      </div>
    </div>
    <div className="town--tavern">
      <div className="town--tavern--info">
        <h2>Tavern</h2>
        <h3>Level: {props.tavernLevel}</h3>
        {props.tavernLevel < tavernMaxLevel && <button onClick={handleTavernLevelClick} disabled={props.gold < tavernUpgradeMultiplier}>Level up <i>(cost {props.tavernLevel * tavernUpgradeMultiplier} gold)</i></button>}
        <p>This is where you can hire more heroes for 3 gold each.</p>
      </div>
      <div className="town--tavern--slots">
        {tavern.map((hero, index) =>
          <div
            key={hero.id + "-" + index}
            className="town--slot"
            draggable={props.gold >= 3}
            onDragStart={() => handleTavernStartDrag(hero)}
          >
            <HeroC hero={heroToBattle(hero)} />
          </div>
        )}
      </div>
      <button onClick={handleTavernRefreshClick} disabled={props.gold < tavernRefreshCost}>Refresh (cost {tavernRefreshCost} gold)</button>
    </div>
    <div className="town--shop"></div>
  </div>;
}
