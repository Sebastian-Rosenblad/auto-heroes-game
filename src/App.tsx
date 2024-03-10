import React, { useEffect, useState } from 'react';
import './App.scss';
import { TownP } from './pages/Town/TownP';
import { HeroM } from './models/hero.model';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomeP } from './pages/Home/HomeP';
import { hasSavedGame, loadSavedGame, saveGame } from './functions/localstorage.functions';
import { LocalStorageM } from './models/localstorage.model';
import { refreshTavern } from './functions/tavern.functions';

function App() {
  const [heroes, setHeroes] = useState<Array<HeroM | undefined>>([]);
  const [tavern, setTavern] = useState<Array<HeroM>>([]);
  const [gold, setGold] = useState<number>(0);
  const [fame, setFame] = useState<number>(0);
  const [tavernLevel, setTavernLevel] = useState<number>(0);
  const [save, setSave] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (save) {
      setSave(false);
      saveGame({
        heroes: heroes,
        tavern: tavern,
        gold: gold,
        fame: fame,
        tavernLevel: tavernLevel
      });
    }
  }, [save]);

  function updateState(values: { [key: string]: any; }) {
    if (values.heroes) setHeroes(values.heroes);
    if (values.tavern) setTavern(values.tavern);
    if (values.gold) setGold(values.gold);
    if (values.fame) setFame(values.fame);
    if (values.tavernLevel) setTavernLevel(values.tavernLevel);
    setSave(true);
  }

  function startNewGame() {
    setHeroes(new Array(10).fill(undefined));
    setTavern(refreshTavern([], 1, 1));
    setGold(11);
    setFame(1);
    setTavernLevel(1);
    setInitialized(true);
    navigate("/town/");
  }
  function continueGame() {
    const saveFile: LocalStorageM = loadSavedGame();
    setHeroes(saveFile.heroes);
    setTavern(saveFile.tavern);
    setGold(saveFile.gold);
    setFame(saveFile.fame);
    setTavernLevel(saveFile.tavernLevel);
    setInitialized(true);
    navigate("/town/");
  }
  function endGame() {
    setInitialized(false);
    navigate("/");
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path='/'
          element= {
            <HomeP
              saveExist={hasSavedGame()}
              newGame={startNewGame}
              continue={continueGame}
            />
          }
        />
        <Route
          path='/town/'
          element= {
            <TownP
              initialized={initialized}
              endGame={endGame}
              heroes={heroes}
              updateHeroes={(value: Array<HeroM | undefined>) => updateState({ heroes: value })}
              gold={gold}
              updateGold={(value: number) => updateState({ gold: value })}
              fame={fame}
              tavern={tavern}
              updateTavern={(value: Array<HeroM>) => updateState({ tavern: value })}
              refreshTavern={() => updateState({ tavern: refreshTavern(heroes, tavernLevel, fame) })}
              tavernLevel={tavernLevel}
              updateTavernLevel={(value: number) => updateState({ tavernLevel: value })}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
