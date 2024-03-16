import React, { useState } from "react";
import './HeroesP.scss';
import { BaseHeroM } from "../../models/base-hero.model";
import { getBaseHeroes, getBaseSummons } from "../../apis/hero.api";

export function HeroesP(): JSX.Element {
  const [heroes, setHeroes] = useState<Array<BaseHeroM>>([...getBaseHeroes(), ...getBaseSummons()]);

  return <div className="heroes">{heroes.map(hero =>
    <div key={hero.name} className={["heroes--hero", hero.rarity.toLocaleLowerCase()].join(" ")}>
      <img src={'/images/heroes/' + hero.image + '.png'} />
      <div className="heroes--hero--header">
        <h2>{hero.name}</h2>
        <p className={hero.rarity.toLocaleLowerCase()}>{hero.rarity}</p>
      </div>
      <div className="heroes--hero--stats">
        <p className="heroes--hero--stats--attack">Attack: {hero.attack}</p>
        <p className="heroes--hero--stats--health">Health: {hero.health}</p>
      </div>
      <div className="heroes--hero--abilities">
        {hero.ability.map((ability, i) => <p key={hero.name + '-ability-' + i} className="heroes--hero--abilities--ability">
          {ability.title && <i>{ability.title} - </i>}{ability.text}
        </p>)}
      </div>
    </div>
  )}</div>;
}
