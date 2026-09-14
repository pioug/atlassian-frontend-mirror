import { SmartLinkSize } from '../../../../constants';

/**
 * Get gap size between elements inside a block
 * Equivalent version for DS primitives space token is getPrimitivesInlineSpaceBySize()
 * at view/FlexibleCard/components/utils.tsx
 */
export const getGapSize = (size: SmartLinkSize): number => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return 1.25;
		case SmartLinkSize.Large:
			return 1;
		case SmartLinkSize.Medium:
			return 0.5;
		case SmartLinkSize.Small:
		default:
			return 0.25;
	}
};
