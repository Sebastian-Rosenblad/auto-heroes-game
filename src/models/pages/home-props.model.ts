import { LocalStorageM } from "../localstorage.model";

export interface HomePropsM {
  save?: LocalStorageM;
  newGame: () => void;
  continue: () => void;
}
