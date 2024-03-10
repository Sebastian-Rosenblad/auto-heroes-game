import React from "react";
import './HomeP.scss'
import { HomePropsM } from "../../models/pages/home-props.model";

export function HomeP(props: HomePropsM): JSX.Element {
  return <div className="home">
    <button onClick={props.newGame}>New Game</button>
    <button onClick={props.continue} disabled={!props.saveExist}>Continue</button>
  </div>;
}
