import { LocalStorageM } from "../localstorage.model";

export interface HomePropsM {
  save?: LocalStorageM;
  saveExist: boolean;
  newGame: () => void;
  continue: () => void;
}
