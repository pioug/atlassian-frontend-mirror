import { Dimensions } from '../common/types';
import {
  mergeGridStateIntoStorage,
  removeFromGridStateInStorage,
} from '../common/utils';

const publishGridState = (gridState: Dimensions) => {
  Object.entries(gridState).forEach(([slotName, value]) => {
    if (!value) {
      document.documentElement.style.removeProperty(`--${slotName}`);
      removeFromGridStateInStorage('gridState', slotName);

      return;
    }

    //Update the css variable
    document.documentElement.style.setProperty(`--${slotName}`, `${value}px`);

    // also update state in local storage so that
    // it persists across page refresh, across tabs etc
    mergeGridStateIntoStorage('gridState', { [slotName]: value });
  });
};

export default publishGridState;
