import React, { useEffect } from "react";
import './BattleP.scss';
import { BattlePropsM } from "../../models/pages/battle-props.model";
import seedrandom from 'seedrandom';

export function BattleP(props: BattlePropsM): JSX.Element {

  useEffect(() => {
    if (!props.initialized) props.endGame();
    else {
      console.log(props.seed);
      const rng = seedrandom(props.seed);
      console.log(rng(), rng(), rng(), rng(), rng(), rng(), rng(), rng(), rng(), rng());
    }
  }, []);

  return <div className="battle"></div>;
}
