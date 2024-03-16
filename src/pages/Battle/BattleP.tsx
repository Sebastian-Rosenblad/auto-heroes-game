import React, { useEffect, useState } from "react";
import './BattleP.scss';
import { BattlePropsM } from "../../models/pages/battle-props.model";
import seedrandom from 'seedrandom';
import { BattleHeroM } from "../../models/battle-hero.model";
import { MonsterM } from "../../models/monster.model";
import { HeroC } from "../../components/Hero/HeroC";
import { MonsterC } from "../../components/Monster/MonsterC";
import { getID, toCamelCase } from "../../functions/utils";
import { EntityNameE } from "../../enums/entity-name.enum";
import { RarityE } from "../../enums/rarity.enum";

interface StateM {
  party: Array<BattleHeroM>;
  monsters: Array<MonsterM>;
  gold: number;
  message: string;
}

export function BattleP(props: BattlePropsM): JSX.Element {
  const [party, setParty] = useState<Array<BattleHeroM>>(props.party);
  const [monsters, setMonsters] = useState<Array<MonsterM>>([]);
  const [gold, setGold] = useState<number>(props.gold);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [battleReport, setBattleReport] = useState<Array<StateM>>([]);
  const [reportIndex, setReportIndex] = useState<number>(0);
  const rng = seedrandom(props.seed);

  useEffect(() => {
    if (!props.initialized) props.endGame();
    else initializeBattle();
  }, []);
  useEffect(() => {
    if (initialized) setBattleReport(generateBattleReport());
  }, [initialized]);
  useEffect(() => {
    if (initialized && reportIndex < battleReport.length) {
      setParty(battleReport[reportIndex].party);
      setMonsters(battleReport[reportIndex].monsters);
      setGold(battleReport[reportIndex].gold);
      console.log(battleReport[reportIndex].message);
    }
    else if (initialized) {
      const lost: boolean = battleReport[battleReport.length - 1].monsters.length > 0;
      props.endBattle(battleReport[battleReport.length - 1].party, battleReport[battleReport.length - 1].gold, lost ? props.lives - 1 : props.lives);
    }
  }, [reportIndex]);

  function initializeBattle() {
    const numberOfMonsters: number = 2 + Math.ceil(props.battles / 2);
    const monsterStats: number = 4 + props.battles * 2;
    let initialMonsters: Array<MonsterM> = [];
    for (let i = 0; i < numberOfMonsters; i++) {
      const type: number = Math.floor(rng() * 3);
      initialMonsters.push({
        id: getID([...party.map(member => member.id), ...initialMonsters.map(monster => monster.id)]),
        image: ["goblinGuardian", "goblinWarrior", "goblinMage"][type],
        attack: Math.round(((type - 1) * 2 + 5) * monsterStats / 10),
        health: Math.round(((1 - type) * 2 + 5) * monsterStats / 10)
      });
    }
    setMonsters(initialMonsters);
    setInitialized(true);
  }
  function generateBattleReport(): Array<StateM> {
    let report: Array<StateM> = [{
      party: party,
      monsters: monsters,
      gold: gold,
      message: ""
    }];
    report = [...report, ...startOfBattleReport(report[0])];
    report = [...report, ...ongoingBattleReport(report[report.length - 1])];
    report = [...report, ...endOfBattleReport(report[report.length - 1])];
    return report;
  }
  function startOfBattleReport(initialState: StateM): Array<StateM> {
    let report: Array<StateM> = [initialState];
    let abilityOrderIDs: Array<string> = [...initialState.party.map(member => member.id).reverse(), ...initialState.monsters.map(monster => monster.id)];
    while (abilityOrderIDs.length > 0) {
      const id: string | undefined = abilityOrderIDs.splice(0, 1)[0];
      const currentState: StateM = report[report.length - 1];
      const hero: BattleHeroM | undefined = currentState.party.find(member => member.id === id);
      if (hero !== undefined) {
        if (hero.name === EntityNameE.scholar) report.push(updateState(currentState, { party: currentState.party.map(member => member.id === id ? updateHero(member, { bonusAttack: member.bonusAttack + hero.level }) : member) }, "Scholar " + hero.id + " gained " + hero.level + " bonus attack"));
        if (hero.name === EntityNameE.armorer) report.push(updateState(currentState, { party: currentState.party.map(member => member.id === id ? member : updateHero(member, { temporaryHealth: member.temporaryHealth + hero.level * 2 })) }, "Armorer " + hero.id + " gave all other heroes " + (hero.level * 2) + " temporary health"));
        if (hero.name === EntityNameE.rat) {
          const index: number = currentState.party.findIndex(member => member.id === id);
          report.push(updateState(currentState, { party: [...currentState.party.slice(0, index), summonHero(hero, currentState), ...currentState.party.slice(index)] }, "Rat " + hero.id + " summoned a poisonous rat"));
        }
        if (hero.name === EntityNameE.druid) {
          const index: number = currentState.party.findIndex(member => member.id === id);
          if (index > 0) {
            const from: number = index - hero.level < 0 ? 0 : index - hero.level, to: number = index;
            report.push(updateState(currentState, { party: [...currentState.party.slice(0, from), ...currentState.party.slice(from, to).map(member => updateHero(member, {
              temporaryAttack: heroIsAnimal(member.name) ? member.temporaryAttack : member.temporaryAttack + hero.level,
              temporaryHealth: heroIsAnimal(member.name) ? member.temporaryHealth : member.temporaryHealth + hero.level,
              bonusAttack: heroIsAnimal(member.name) ? member.bonusAttack + hero.level : member.bonusAttack,
              bonusHealth: heroIsAnimal(member.name) ? member.bonusHealth + hero.level : member.bonusHealth
            })), ...currentState.party.slice(to)] }, "Druid " + hero.id + " gave " + hero.level + " other heroes " + hero.level + " temporary health"));
          }
        }
        if (hero.name === EntityNameE.bard) {
          report.push(updateState(currentState, { party: currentState.party.map(member => {
            const effect: number = Math.floor(rng() * 5);
            return member.id === hero.id ? member : updateHero(member, {
              temporaryAttack: effect === 0 ? member.temporaryAttack + hero.level : undefined,
              temporaryHealth: effect === 1 ? member.temporaryHealth + hero.level : undefined,
              poisonous: effect === 2 ? true : undefined,
              shield: effect === 3 ? member.shield + hero.level : undefined,
              firstStrike: effect === 4 ? member.firstStrike + hero.level : undefined
            })}
          ) }, "Bard " + hero.id + " gave other heroes random buffs"));
        }
      }
    }
    return report.slice(1);
  }
  function ongoingBattleReport(initialState: StateM): Array<StateM> {
    let report: Array<StateM> = [initialState];
    return report.slice(1);
  }
  function endOfBattleReport(initialState: StateM): Array<StateM> {
    let report: Array<StateM> = [initialState];
    return report.slice(1);
  }
  function viewNext() {
    setReportIndex(reportIndex + 1);
  }
  function viewPrev() {
    setReportIndex(reportIndex - 1);
  }

  function updateState(state: StateM, changes: { [key: string]: any; }, message: string): StateM {
    return {
      party: changes.party || state.party,
      monsters: changes.monsters || state.monsters,
      gold: changes.gold || state.gold,
      message: message
    };
  }
  function updateHero(hero: BattleHeroM, changes: { [key: string]: any; }): BattleHeroM {
    return {
      id: hero.id,
      name: hero.name,
      image: hero.image,
      rarity: hero.rarity,
      level: changes.level || hero.level,
      experience: changes.experience || hero.experience,
      baseAttack: hero.baseAttack,
      baseHealth: hero.baseHealth,
      bonusAttack: changes.bonusAttack || hero.bonusAttack,
      bonusHealth: changes.bonusHealth || hero.bonusHealth,
      temporaryAttack: changes.temporaryAttack || hero.temporaryAttack,
      temporaryHealth: changes.temporaryHealth || hero.temporaryHealth,
      poisonous: changes.poisonous || hero.poisonous,
      shield: changes.shield || hero.shield,
      firstStrike: changes.firstStrike || hero.firstStrike,
      poison: changes.poison || hero.poison
    };
  }
  function summonHero(hero: BattleHeroM, state: StateM): BattleHeroM {
    let summonedHero: BattleHeroM = {} as BattleHeroM;
    if (hero.name === EntityNameE.rat) summonedHero = {
      id: getID([...state.party.map(member => member.id), ...state.monsters.map(monster => monster.id)]),
      name: EntityNameE.poisonousRat,
      image: toCamelCase(EntityNameE.poisonousRat),
      rarity: RarityE.summon,
      level: hero.level,
      experience: 0,
      baseAttack: 0,
      baseHealth: 0,
      bonusAttack: 0,
      bonusHealth: 0,
      temporaryAttack: hero.baseAttack + hero.bonusAttack + hero.temporaryAttack,
      temporaryHealth: Math.round((hero.baseHealth + hero.bonusHealth + hero.temporaryHealth) / 2),
      poisonous: true,
      shield: 0,
      firstStrike: 0,
      poison: 0
    }
    return summonedHero;
  }
  function heroIsAnimal(name: EntityNameE): boolean {
    if (name === EntityNameE.blueJay) return true;
    if (name === EntityNameE.cat) return true;
    if (name === EntityNameE.dragon) return true;
    if (name === EntityNameE.dragonEgg) return true;
    if (name === EntityNameE.loneWolf) return true;
    if (name === EntityNameE.loyalCompanion) return true;
    if (name === EntityNameE.mule) return true;
    if (name === EntityNameE.panda) return true;
    if (name === EntityNameE.poisonousRat) return true;
    if (name === EntityNameE.rat) return true;
    if (name === EntityNameE.spiderEgg) return true;
    if (name === EntityNameE.spiderling) return true;
    return false;
  }

  return <div className="battle">
    <div className="battle--banner">
      <div className="battle--banner--item">
        <h2>Gold: {gold}</h2>
      </div>
      <div className="battle--banner--item">
        <h2>Lives: {props.lives}</h2>
      </div>
      <div className="battle--banner--item">
        <h2>Monster level: {props.battles + 1}</h2>
      </div>
    </div>
    <div className="battle--field">
      <div className="battle--field--column-left"><div className="battle--field--column-left--party">
        {party.map(hero => <HeroC key={hero.id} hero={hero} />)}
      </div></div>
      <div className="battle--field--column-right"><div className="battle--field--column-right--monsters">
        {monsters.map(monster => <MonsterC key={'monster-' + monster.id} monster={monster} />)}
      </div></div>
    </div>
    <div className="battle--view-buttons">
      {reportIndex > 0 && <button onClick={viewPrev}>Prevous</button>}
      <button onClick={viewNext}>{reportIndex === 0 ? "Start battle" : reportIndex === battleReport.length - 1 ? "End battle" : "Next"}</button>
    </div>
  </div>;
}
