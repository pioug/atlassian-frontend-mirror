import { useMemo } from 'react';
import { type Breakpoint } from './ui/common';
import { calcBreakpointSize } from './ui/styles';
import { type CardDimensionValue } from '../types';
import {
  getElementDimension,
  isValidPercentageUnit,
  defaultImageCardDimensions,
} from '../utils';

// Hook to calculate the breakpoint based on the width of the element
export const useBreakpoint = (
  dimensionWidth: CardDimensionValue = 0,
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
