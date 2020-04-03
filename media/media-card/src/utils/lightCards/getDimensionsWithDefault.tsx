import { CardDimensions } from '../..';

export const getDimensionsWithDefault = (
  dimensions: CardDimensions = { width: '100%', height: '100%' },
): CardDimensions => {
  return {
    height:
      typeof dimensions.height === 'number'
        ? `${dimensions.height}px`
        : dimensions.height,
    width:
      typeof dimensions.width === 'number'
        ? `${dimensions.width}px`
        : dimensions.width,
  };
};
