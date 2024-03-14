import React, { useEffect, useState } from 'react';
import './App.scss';
import { TownP } from './pages/Town/TownP';
import { HeroM } from './models/hero.model';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomeP } from './pages/Home/HomeP';
import { hasSavedGame, loadSavedGame, saveGame } from './functions/localstorage.functions';
import { LocalStorageM } from './models/localstorage.model';
import { refreshTavern } from './functions/tavern.functions';
import { BattleHeroM } from './models/battle-hero.model';
import { BattleP } from './pages/Battle/BattleP';
import { heroToBattle } from './functions/hero.functions';

function App() {
  const [heroes, setHeroes] = useState<Array<HeroM | undefined>>([]);
  const [party, setParty] = useState<Array<BattleHeroM>>([]);
  const [tavern, setTavern] = useState<Array<HeroM>>([]);
  const [gold, setGold] = useState<number>(0);
  const [lives, setLives] = useState<number>(0);
  const [fame, setFame] = useState<number>(0);
  const [tavernLevel, setTavernLevel] = useState<number>(0);
  const [battles, setBattles] = useState<number>(0);
  const [battleSeed, setBattleSeed] = useState<string>("");
  const [save, setSave] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (save) {
      setSave(false);
      saveGame({
        lives: lives,
        heroes: heroes,
        tavern: tavern,
        gold: gold,
        fame: fame,
        tavernLevel: tavernLevel,
        seed: battleSeed
      });
    }
  }, [save]);
  useEffect(() => {
    if (!initialized) navigate("/");
    else if (battleSeed === "") navigate("/town/");
    else navigate("/battle/");
  }, [initialized, battleSeed]);

  function updateState(values: { [key: string]: any; }) {
    if (values.heroes) setHeroes(values.heroes);
    if (values.tavern) setTavern(values.tavern);
    if (values.gold) setGold(values.gold);
    if (values.fame) setFame(values.fame);
    if (values.tavernLevel) {
      setTavernLevel(values.tavernLevel);
      setTavern(refreshTavern(heroes, values.tavernLevel, fame));
    }
    setSave(true);
  }

  function startNewGame() {
    setLives(3);
    setHeroes(new Array(10).fill(undefined));
    setTavern(refreshTavern([], 1, 1));
    setGold(110);
    setFame(1);
    setTavernLevel(1);
    setBattles(0);
    setInitialized(true);
  }
  function continueGame() {
    const saveFile: LocalStorageM = loadSavedGame();
    setLives(saveFile.lives);
    setHeroes(saveFile.heroes);
    setTavern(saveFile.tavern);
    setGold(saveFile.gold);
    setFame(saveFile.fame);
    setTavernLevel(saveFile.tavernLevel);
    setInitialized(true);
    setBattleSeed(saveFile.seed);
  }
  function endGame() {
    setInitialized(false);
    navigate("/");
  }

  function startBattle() {
    setParty(heroes.slice(0, 6).filter((hero: HeroM | undefined): hero is HeroM => hero !== undefined).map(heroToBattle));
    const seed: string = Math.random().toString(36).substring(2, 15);
    setBattleSeed(`${Date.now()}-${seed}`);
    setSave(true);
  }
  function endBattle(newParty: Array<BattleHeroM>, newGold: number, newLives: number) {
    setHeroes(heroes.map(hero => hero === undefined ? undefined : updateHero(hero, newParty)));
    setGold(newGold + 6);
    setLives(newLives);
    setBattles(battles + 1);
    setBattleSeed("");
    if (fame < 3 && (battles + 1) % 5 === 0) setFame(fame + 1);
    setSave(true);
  }
  function updateHero(hero: HeroM, party: Array<BattleHeroM>): HeroM {
    const battleHero: BattleHeroM | undefined = party.find(member => member.id === hero.id);
    if (battleHero !== undefined) {
      return {
        id: hero.id,
        level: battleHero.level,
        experience: battleHero.experience,
        bonusAttack: battleHero.bonusAttack,
        bonusHealth: battleHero.bonusHealth,
        base: hero.base
      };
    }
    return hero;
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path='/'
          element= {
            <HomeP
              save={hasSavedGame() ? loadSavedGame() : undefined}
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
              lives={lives}
              gold={gold}
              updateGold={(value: number) => updateState({ gold: value })}
              fame={fame}
              tavern={tavern}
              updateTavern={(value: Array<HeroM>) => updateState({ tavern: value })}
              refreshTavern={() => updateState({ tavern: refreshTavern(heroes, tavernLevel, fame) })}
              tavernLevel={tavernLevel}
              updateTavernLevel={(value: number) => updateState({ tavernLevel: value })}
              startBattle={startBattle}
            />
          }
        />
        <Route
          path='/battle/'
          element={
            <BattleP
              initialized={initialized}
              endGame={endGame}
              party={party}
              gold={gold}
              lives={lives}
              battles={battles}
              seed={battleSeed}
              endBattle={endBattle}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
