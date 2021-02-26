import { DimensionNames, Dimensions } from '../common/types';

import {
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DIMENSIONS,
  LEFT_PANEL_WIDTH,
  PAGE_LAYOUT_LS_KEY,
  PAGE_LAYOUT_SLOT_SELECTOR,
} from './constants';
import safeLocalStorage from './safe-local-storage';

const emptyGridState: Dimensions = DIMENSIONS.reduce(
  (acc, currentValue) => ({ ...acc, [currentValue]: 0 }),
  {},
);

const mergeGridStateIntoStorage = (key: string, value: any) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  if (value !== null && typeof value === 'object') {
    storageValue[key] = { ...storageValue[key], ...value };
  } else {
    storageValue[key] = value;
  }

  safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};

const getGridStateFromStorage = (key: string) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  return storageValue[key];
};

const removeFromGridStateInStorage = (key: string, secondKey?: string) => {
  const storageValue = JSON.parse(
    safeLocalStorage().getItem(PAGE_LAYOUT_LS_KEY) || '{}',
  );

  if (secondKey && storageValue[key]) {
    delete storageValue[key][secondKey];
  } else {
    delete storageValue[key];
  }

  safeLocalStorage().setItem(PAGE_LAYOUT_LS_KEY, JSON.stringify(storageValue));
};

const resolveDimension = (
  key: DimensionNames,
  dimension: number = 0,
  shouldPersist: boolean = false,
) => {
  if (shouldPersist) {
    const cachedGridState = getGridStateFromStorage('gridState');

    return cachedGridState &&
      Object.keys(cachedGridState).length > 0 &&
      cachedGridState[key]
      ? cachedGridState[key]
      : dimension;
  }

  return dimension;
};

const getLeftPanelWidth = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  return (
    parseInt(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`--${LEFT_PANEL_WIDTH}`),
      10,
    ) || 0
  );
};

const getLeftSidebarPercentage = (currentWidth: number, maxWidth: number) => {
  const total =
    (currentWidth - DEFAULT_LEFT_SIDEBAR_WIDTH) /
    (maxWidth - DEFAULT_LEFT_SIDEBAR_WIDTH);

  if (total < 0) {
    return 0;
  }
  if (total > 1) {
    return 100;
  }

  return Math.floor(total * 100);
};

const getPageLayoutSlotSelector = (slotName: string) => ({
  [PAGE_LAYOUT_SLOT_SELECTOR]: slotName,
});

const getPageLayoutSlotCSSSelector = (slotName: string) =>
  `[${PAGE_LAYOUT_SLOT_SELECTOR}='${slotName}']`;

export {
  emptyGridState,
  mergeGridStateIntoStorage,
  getGridStateFromStorage,
  removeFromGridStateInStorage,
  resolveDimension,
  getLeftPanelWidth,
  getLeftSidebarPercentage,
  getPageLayoutSlotSelector,
  getPageLayoutSlotCSSSelector,
};
