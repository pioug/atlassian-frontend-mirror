import { StickyPluginState } from './types';

// only worry about the first row for now
export const findStickyHeaderForTable = (
  state: StickyPluginState,
  tablePos: number | undefined,
) => {
  if (!state || tablePos === undefined) {
    return undefined;
  }

  const rowInfo = state.find((rowInfo) => rowInfo.pos === tablePos + 1);
  if (!rowInfo) {
    return undefined;
  }

  return rowInfo.sticky ? rowInfo : undefined;
};
