import { isValidPercentageUnit } from './isValidPercentageUnit';
import { containsPixelUnit } from './containsPixelUnit';
import { CardDimensionValue, CardDimensions } from '../';

export const canCompareDimension = (
  current?: CardDimensionValue,
  next?: CardDimensionValue,
) => {
  if (!current || !next) {
    return false;
  }
  if (isValidPercentageUnit(current) && isValidPercentageUnit(next)) {
    return true;
  }
  if (containsPixelUnit(`${current}`) && containsPixelUnit(`${next}`)) {
    return true;
  }
  if (typeof current === 'number' && typeof next === 'number') {
    return true;
  }
  return false;
};

export const isBigger = (current: CardDimensions, next: CardDimensions) => {
  if (
    canCompareDimension(current.width, next.width) &&
    canCompareDimension(current.height, next.height)
  ) {
    const nextIsHigher =
      parseInt(`${current.width}`, 10) < parseInt(`${next.width}`, 10);
    const nextIsWider =
      parseInt(`${current.height}`, 10) < parseInt(`${next.height}`, 10);
    return nextIsHigher || nextIsWider;
  } else {
    return false;
  }
};
