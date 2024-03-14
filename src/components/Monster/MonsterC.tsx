import React from "react";
import './MonsterC.scss';
import { MonsterPropsM } from "../../models/components/monster-props.model";

export function MonsterC(props: MonsterPropsM): JSX.Element {
  return <div className="monster">
    <img className="monster--art" src={`/images/monsters/${props.monster.image}.png`} />
    <div className="monster--attack"><p>{props.monster.attack}</p></div>
    <div className="monster--health"><p>{props.monster.health}</p></div>
  </div>;
}
