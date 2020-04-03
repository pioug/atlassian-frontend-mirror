import { gridSize } from '../../../shared-variables';

const prefix = name => `__ak_nav_collapsed_overflow_${name}`;
export const shouldReportItemHeight = prefix('shouldReportItemHeight');
export const reportItemHeightToGroup = prefix('reportItemHeight');

export const overflowManagerNamespace = prefix('manager_ns');
export const overflowGroupNamespace = prefix('group_ns');

export const dropdownHeight = gridSize * 5;
export const reservedGapHeight = gridSize * 4;

export const isArrayFilled = testArray => {
  // Note: we can't use a simple testArray.length check here because it is a set-length
  // array; We also can't use .filter(Boolean).length because that skips any undefined items.
  for (let i = 0; i < testArray.length; i++) {
    if (typeof testArray[i] === 'undefined') {
      return false;
    }
  }
  return true;
};
