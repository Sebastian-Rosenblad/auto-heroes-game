import React from "react";
import './HeroC.scss';
import { HeroPropsM } from "../../models/components/hero-props.model";
import { EntityNameE } from "../../enums/entity-name.enum";

export function HeroC(props: HeroPropsM): JSX.Element {
  return <div className="hero">
    <img className="hero--art" src={`/images/heroes/${props.hero.image}.png`} />
    <div className="hero--level"><p>{props.hero.level}</p></div>
    <div className="hero--experience">
      <div className="hero--experience--bar" style={{ "width": (props.hero.experience / (props.hero.name === EntityNameE.fighter ? 5 : (props.hero.level + 1) * 5) * 100) + "%" }}></div>
      <p>{props.hero.experience}</p>
    </div>
    <div className="hero--attack"><p>{props.hero.baseAttack + props.hero.bonusAttack + props.hero.temporaryAttack}</p></div>
    <div className="hero--health"><p>{props.hero.baseHealth + props.hero.bonusHealth + props.hero.temporaryHealth}</p></div>
    <div className="hero--buffs">
      {props.hero.firstStrike > 0 && <p className="hero--buffs--first-strike">{props.hero.firstStrike}</p>}
      {props.hero.shield > 0 && <p className="hero--buffs--shield">{props.hero.shield}</p>}
      {props.hero.poison > 0 && <p className="hero--buffs--poison">{props.hero.poison}</p>}
    </div>
  </div>;
}
