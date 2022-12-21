import { PickerSize } from '../../types';
import { sizeGap } from '../../util/constants';

export const emojiPickerHeightOffset = (size: PickerSize) => {
  if (size === 'medium') {
    return sizeGap;
  } else if (size === 'large') {
    return sizeGap * 2;
  }
  return 0;
};
