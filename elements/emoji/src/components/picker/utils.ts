import type { PickerSize } from '../../types';
import { sizeGap } from '../../util/constants';

export const emojiPickerHeightOffset = (size: PickerSize) => {
	if (size === 'medium') {
		return sizeGap;
	} else if (size === 'large') {
		return sizeGap * 2;
	}
	return 0;
};

// this function is being exported so it can be mocked in unit tests
export const scrollToRow = (listRef: any, index?: number): void => {
	listRef.current?.scrollToRow(index);
};
