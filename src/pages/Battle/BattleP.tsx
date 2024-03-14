import React, { useEffect } from "react";
import './BattleP.scss';
import { BattlePropsM } from "../../models/pages/battle-props.model";

export function BattleP(props: BattlePropsM): JSX.Element {

  useEffect(() => {
    if (!props.initialized) props.endGame();
  }, []);

  return <div className="battle"></div>;
}
