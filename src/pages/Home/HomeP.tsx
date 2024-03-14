import React from "react";
import './HomeP.scss'
import { HomePropsM } from "../../models/pages/home-props.model";
import { HeroC } from "../../components/Hero/HeroC";
import { heroToBattle } from "../../functions/hero.functions";

export function HomeP(props: HomePropsM): JSX.Element {
  return <div className="home">
    <button onClick={props.newGame}>New Game</button>
    <button onClick={props.continue} disabled={!props.saveExist}>Continue</button>
    {props.save && <div className="saved-game">
      <h2>Saved game:</h2>
      <div className="saved-game--stats">
        <h3>Gold: {props.save.gold}</h3>
        <h3>Lives: {props.save.lives}</h3>
        <h3>Fame: {props.save.fame}</h3>
      </div>
      <div className="saved-game--field">{props.save.heroes.slice(0, 6).map((hero, i) => hero === undefined ? <div key={'empty-' + i} className="saved-game--field--empty-slot"></div> : <HeroC key={'hero-' + i} hero={heroToBattle(hero)} tiny />)}</div>
      <div className="saved-game--bench">{props.save.heroes.slice(6).map((hero, i) => hero === undefined ? <div key={'empty-' + (i + 6)} className="saved-game--bench--empty-slot"></div> : <HeroC key={'hero-' + (i + 6)} hero={heroToBattle(hero)} tiny />)}</div>
    </div>}
  </div>;
}
