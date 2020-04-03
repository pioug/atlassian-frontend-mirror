import { css } from 'styled-components';

import hasOwnProperty from '../utils/has-own-property';
import { container, global, dark } from './presets';

export const prefix = key =>
  `@atlaskit-private-theme-do-not-use/navigation:${key}`;
export const rootKey = prefix('root');
export const groupKey = prefix('group');
export const isDropdownOverflowKey = prefix('isDropdownOverflow');
export const isElectronMacKey = prefix('isElectronMac');
export const electronMacTopPadding = 14;

export const isElectronMac = map =>
  map !== undefined &&
  hasOwnProperty(map, isElectronMacKey) &&
  map[isElectronMacKey];

export const getProvided = map => {
  if (map !== undefined && hasOwnProperty(map, rootKey) && map[rootKey]) {
    return map[rootKey].provided;
  }
  return container;
};
export const isCollapsed = map => map[rootKey] && map[rootKey].isCollapsed;

export const isInOverflowDropdown = map =>
  hasOwnProperty(map, isDropdownOverflowKey);

export const isInCompactGroup = map => {
  if (!hasOwnProperty(map, groupKey)) {
    return false;
  }
  return map[groupKey].isCompact;
};

export const whenCollapsed = (...args) => css`
  ${({ theme }) => (isCollapsed(theme) ? css(...args) : '')};
`;

export const whenNotCollapsed = (...args) => css`
  ${({ theme }) => (!isCollapsed(theme) ? css(...args) : '')};
`;

export const whenNotInOverflowDropdown = (...args) => css`
  ${({ theme }) => (!isInOverflowDropdown(theme) ? css(...args) : '')};
`;

export const whenCollapsedAndNotInOverflowDropdown = (...args) => css`
  ${({ theme }) =>
    isCollapsed(theme) && !isInOverflowDropdown(theme) ? css(...args) : ''};
`;

export const getProvidedScrollbar = map => {
  if (
    map !== undefined &&
    hasOwnProperty(map, rootKey) &&
    map[rootKey] &&
    map[rootKey].provided.scrollBar
  ) {
    return map[rootKey].provided.scrollBar;
  }
  return container.scrollBar;
};

// NOTE: Dark mode is a user preference that takes precedence over provided themes
export const defaultContainerTheme = (containerTheme, mode) => {
  if (containerTheme && containerTheme.hasDarkmode) {
    return containerTheme;
  }
  if (mode === 'dark') {
    return dark;
  }
  return containerTheme || container;
};
export const defaultGlobalTheme = (globalTheme, mode) => {
  if (globalTheme && globalTheme.hasDarkmode) return globalTheme;
  if (mode === 'dark') {
    return dark;
  }
  return globalTheme || global;
};

export { default as WithRootTheme } from './with-root-theme';
