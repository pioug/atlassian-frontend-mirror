import { CardAppearance, CardDimensions } from '../types';

export const defaultImageCardDimensions = {
  width: 156,
  height: 125,
};

export const defaultHorizontalCardDimensions = {
  width: 435,
  height: 125,
};

export const defaultSquareCardDimensions = {
  width: 300,
  height: 300,
};

export const getDefaultCardDimensions = (
  appearance?: CardAppearance,
): Required<CardDimensions> => {
  if (appearance === 'image') {
    return defaultImageCardDimensions;
  }

  if (appearance === 'square') {
    return defaultSquareCardDimensions;
  }

  if (appearance === 'horizontal') {
    return defaultHorizontalCardDimensions;
  }

  return defaultImageCardDimensions;
};
