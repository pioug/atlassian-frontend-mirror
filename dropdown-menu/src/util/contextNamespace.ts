const prefix = (key: string): string =>
  `@atlaskit-private-do-not-use/dropdown-menu:${key}`;

export const focusManagerContext = prefix('focus-manager');
export const selectionCacheContext = prefix('selection-cache');
export const selectionManagerContext = prefix('selection-manager');
export const clickManagerContext = prefix('click-manager');
