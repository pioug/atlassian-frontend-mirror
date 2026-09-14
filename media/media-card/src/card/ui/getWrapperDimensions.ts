import { type CardDimensions, type CardAppearance } from '../../types';
import { getDefaultCardDimensions } from '../../utils/cardDimensions';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';

export const getWrapperDimensions = (dimensions?: CardDimensions, appearance?: CardAppearance) => {
	const { width, height } = dimensions || {};
	const { width: defaultWidth, height: defaultHeight } = getDefaultCardDimensions(appearance);
	return `
	/* If container doesn't exists, it will fallback to this */
	width: ${getCSSUnitValue(width || defaultWidth)};

    max-width: 100%;
    height: ${getCSSUnitValue(height || defaultHeight)};
    max-height: 100%;
  `;
};
