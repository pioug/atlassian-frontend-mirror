import { useState } from 'react';
import cssVars from 'css-vars-ponyfill';
import { mergeGridStateIntoStorage, emptyGridState } from '../common/utils';
import { Dimensions } from '../common/types';

var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const usePageLayoutGrid = (initialDimensions: Dimensions = emptyGridState) => {
  const [gridState, setGridState] = useState(initialDimensions);

  if (!canUseDOM) {
    return [emptyGridState, setGridState] as const;
  }

  Object.entries(gridState).forEach(([slotName, value]) => {
    //Update the css variable
    document.documentElement.style.setProperty(`--${slotName}`, `${value}px`);

    // also update state in local storage so that
    // it persists across page refresh, across tabs etc
    mergeGridStateIntoStorage('gridState', { [slotName]: value });

    /*IE11*/
    cssVars({
      variables: {
        [slotName]: `${value}px`,
      },
      silent: true,
    });
    /*IE11*/
  });

  return [gridState, setGridState] as const;
};

export default usePageLayoutGrid;
