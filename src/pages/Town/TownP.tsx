import React, { useEffect, useState } from "react";
import './TownP.scss';
import { TownPropsM } from "../../models/pages/town-props.model";
import { HeroM } from "../../models/hero.model";
import { HeroC } from "../../components/Hero/HeroC";
import { getHeroToolTipText, heroToBattle } from "../../functions/hero.functions";
import { EntityNameE } from "../../enums/entity-name.enum";

export function TownP(props: TownPropsM): JSX.Element {
  const [buying, setBuying] = useState<HeroM | undefined>(undefined);
  const [moving, setMoving] = useState<number | undefined>(undefined);
  const tavernUpgradeMultiplier: number = 8;
  const tavernMaxLevel: number = 3;
  const tavernRefreshCost: number = 1;

  useEffect(() => {
    if (!props.initialized) props.endGame();
  }, []);

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
      if (props.heroes[index] === undefined) {
        props.updateHeroes([...props.heroes.map((hero, i) => index === i ? buying : hero)]);
        props.updateTavern([...props.tavern.filter(hero => hero.id !== buying.id)]);
        props.updateGold(props.gold - 3);
      }
      else buyMergeHero(index);
    }
    else if (moving !== undefined) {
      const fromHero: HeroM | undefined = props.heroes[moving];
      const toHero: HeroM | undefined = props.heroes[index];
      if (fromHero !== undefined && toHero !== undefined && fromHero.id !== toHero.id && fromHero.base.name === toHero.base.name) {
        props.updateHeroes([...props.heroes.map((hero, i) => i === index ? mergeHero(toHero, fromHero) : i === moving ? undefined : hero)]);
      }
      else props.updateHeroes([...props.heroes.map((hero, i) => i === index ? fromHero : i === moving ? toHero : hero)]);
    }
  }
  function handleDropOverDismiss() {
    if (moving !== undefined) {
      const dismissHero: HeroM | undefined = props.heroes[moving];
      if (dismissHero !== undefined) {
        let newHeroes: Array<HeroM | undefined> = [...props.heroes.map(hero => hero?.id === dismissHero.id ? undefined : hero)];
        if (dismissHero.base.name === EntityNameE.mule) {
          newHeroes.forEach(hero => {
            if (hero !== undefined) hero.bonusHealth += Math.floor((dismissHero.base.health * dismissHero.level + dismissHero.bonusHealth) / 8);
          });
        }
        if (dismissHero.base.name === EntityNameE.squire) {
          let targetIDs: Array<string> = newHeroes.map(hero => hero?.id || "").filter(id => id.length > 0).sort(() => Math.random() - .5).slice(0, dismissHero.level);
          newHeroes.forEach(hero => {
            if (hero !== undefined && targetIDs.includes(hero.id)) hero.bonusAttack += dismissHero.level;
          })
        }
        props.updateHeroes(newHeroes);
      }
    }
  }
  function buyMergeHero(index: number) {
    const hero: HeroM | undefined = props.heroes[index];
    if (hero !== undefined && buying !== undefined) {
      props.updateHeroes([...props.heroes.map((h, i) => index === i ? mergeHero(hero, buying) : h)]);
      props.updateTavern([...props.tavern.filter(h => h.id !== buying.id)]);
      props.updateGold(props.gold - 3)
    }
  }
  function mergeHero(a: HeroM, b: HeroM): HeroM {
    if (a.base.name === EntityNameE.fighter) {
      const experience: number = a.experience + b.experience;
      return {
        id: a.id,
        level: a.level + b.level + Math.floor(experience / 5),
        experience: experience % 5,
        bonusAttack: a.bonusAttack + b.bonusAttack,
        bonusHealth: a.bonusHealth + b.bonusHealth,
        base: a.base
      }
    }
    const expGain: number = (b.level * (b.level + 1)) * 2.5 + b.experience;
    const didLevelUp: boolean = a.experience + expGain >= (a.level + 1) * 5;
    const expRest: number = didLevelUp ? a.experience + expGain - (a.level + 1) * 5 : a.experience + expGain;
    let hero: HeroM = {
      id: a.id,
      level: a.level + (didLevelUp ? 1 : 0),
      experience: expRest,
      bonusAttack: a.bonusAttack + b.bonusAttack,
      bonusHealth: a.bonusHealth + b.bonusHealth,
      base: a.base
    };
    if (didLevelUp && hero.base.name === EntityNameE.mule) hero.bonusHealth += hero.base.health * hero.level + hero.bonusHealth;
    return hero;
  }
  function handleTavernLevelClick() {
    props.updateTavernLevel(props.tavernLevel + 1);
    props.updateGold(props.gold - props.tavernLevel * tavernUpgradeMultiplier);
  }
  function handleTavernRefreshClick() {
    props.updateGold(props.gold - tavernRefreshCost);
    props.refreshTavern();
  }

  return <div className="town">
    <div className="town--banner">
      <div className="town--banner--item">
        <h2>Gold: {props.gold}</h2>
      </div>
      <div className="town--banner--item">
        <h2>Lives: {props.lives}</h2>
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
        {props.heroes.slice(0, 6).map((hero, index) => hero === undefined ?
          <div
            key={"empty-hero-" + index}
            className="town--slot--empty"
            onDragOver={(evt) => evt.preventDefault()}
            onDrop={() => handleDropOverHero(index)}
          ></div> :
          <div
            key={hero.id + "-" + index}
            className="town--slot tooltip-container"
            draggable
            onDragStart={() => handleHeroStartDrag(index)}
            onDragOver={(evt) => evt.preventDefault()}
            onDrop={() => handleDropOverHero(index)}
          >
            <HeroC hero={heroToBattle(hero)}/>
            {getHeroToolTipText(hero)}
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
        {props.heroes.slice(6).map((hero, index) => hero === undefined ?
          <div
          key={"empty-hero-" + index}
          className="town--slot--empty"
          onDragOver={(evt) => evt.preventDefault()}
          onDrop={() => handleDropOverHero(index + 6)}
        ></div> :
        <div
          key={hero.id + "-" + index}
          className="town--slot tooltip-container"
          draggable
          onDragStart={() => handleHeroStartDrag(index + 6)}
          onDragOver={(evt) => evt.preventDefault()}
          onDrop={() => handleDropOverHero(index + 6)}
        >
          <HeroC hero={heroToBattle(hero)}/>
          {getHeroToolTipText(hero)}
        </div>
        )}
      </div>
    </div>
    <div className="town--tavern">
      <div className="town--tavern--info">
        <h2>Tavern</h2>
        <h3>Level: {props.tavernLevel}</h3>
        {props.tavernLevel < tavernMaxLevel && <button onClick={handleTavernLevelClick} disabled={props.gold < props.tavernLevel * tavernUpgradeMultiplier}>Level up <i>(cost {props.tavernLevel * tavernUpgradeMultiplier} gold)</i></button>}
        <p>This is where you can hire more heroes for 3 gold each.</p>
      </div>
      <div className="town--tavern--slots">
        {props.tavern.map((hero, index) =>
          <div
            key={hero.id + "-" + index}
            className="town--slot tooltip-container"
            draggable={props.gold >= 3}
            onDragStart={() => handleTavernStartDrag(hero)}
          >
            <HeroC hero={heroToBattle(hero)} />
            {getHeroToolTipText(hero)}
          </div>
        )}
      </div>
      <button onClick={handleTavernRefreshClick} disabled={props.gold < tavernRefreshCost}>Refresh (cost {tavernRefreshCost} gold)</button>
      <div
        className="town--slot--empty"
        onDragOver={(evt) => evt.preventDefault()}
        onDrop={handleDropOverDismiss}
      ><p>Dismiss</p></div>
    </div>
    <div className="town--shop"></div>
    <button onClick={props.startBattle}>Start Battle!</button>
  </div>;
}
