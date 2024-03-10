import React, { useState } from 'react';
import './App.scss';
import { TownP } from './pages/Town/TownP';
import { HeroM } from './models/hero.model';

function App() {
  const [heroes, setHeroes] = useState<Array<HeroM | undefined>>([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
  const [gold, setGold] = useState<number>(110);
  const [fame, setFame] = useState<number>(1);
  const [tavernLevel, setTavernLevel] = useState<number>(1);

  return (
    <div className="App">
      <TownP
        heroes={heroes}
        updateHeroes={setHeroes}
        gold={gold}
        updateGold={setGold}
        fame={fame}
        tavernLevel={tavernLevel}
        updateTavernLevel={setTavernLevel}
      />
    </div>
  );
}

export default App;
