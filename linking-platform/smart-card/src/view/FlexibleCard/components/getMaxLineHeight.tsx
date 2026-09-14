import { SmartLinkSize } from '../../../constants';

export const getMaxLineHeight = (size: SmartLinkSize): 1.75 | 1.5 => {
	// The maximum line height based on all elements in specific size.
	// These heights belongs to AvatarGroup.
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return 1.75;
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return 1.5;
	}
};
