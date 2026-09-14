import { useMemo } from 'react';

import { type CardDimensionValue } from '../types';
import { defaultImageCardDimensions } from '../utils/cardDimensions';
import { getElementDimension } from '../utils/getElementDimension';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { calcBreakpointSize } from './ui/calcBreakpointSize';
import { type Breakpoint } from './ui/common';

// Hook to calculate the breakpoint based on the width of the element
export const useBreakpoint = (
	dimensionWidth: CardDimensionValue | undefined = 0,
	divRef: React.RefObject<HTMLDivElement>,
): Breakpoint => {
	const breakpoint = useMemo(() => {
		let widthToCalculate;
		if (dimensionWidth) {
			if (isValidPercentageUnit(dimensionWidth) && divRef.current) {
				const width = getElementDimension(divRef.current, 'width');
				widthToCalculate = width || defaultImageCardDimensions.width;
			} else {
				widthToCalculate = dimensionWidth;
			}
		} else {
			widthToCalculate = defaultImageCardDimensions.width;
		}
		return calcBreakpointSize(parseInt(`${widthToCalculate}`, 10));
	}, [dimensionWidth, divRef]);

	return breakpoint;
};
