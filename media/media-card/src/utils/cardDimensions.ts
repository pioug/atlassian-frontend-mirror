import { CardAppearance, CardDimensionValue } from '../types';

export interface CardDimensions {
  width?: CardDimensionValue;
  height?: CardDimensionValue;
}

// Default dimensions

export const defaultSmallCardDimensions = {
  width: '100%',
  height: 42,
};

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

// Small dimensions

export const minSmallCardDimensions = {
  width: 200,
  height: 32,
};

export const minImageCardDimensions = {
  width: 144,
  height: 96,
};

export const minSquareCardDimensions = {
  width: 272,
  height: 275,
};

export const minHorizontalCardDimensions = {
  width: 400,
  height: 125,
};

// Max dimensions

export const maxImageCardDimensions = {
  width: 480,
  height: 360,
};

export const maxHorizontalCardDimensions = {
  width: 400,
  height: 116,
};

export const maxSquareCardDimensions = {
  width: 400,
  height: 348,
};

export const getCardMaxHeight = (appearance?: CardAppearance) => {
  if (appearance === 'image') {
    return maxImageCardDimensions.height;
  }

  if (appearance === 'horizontal') {
    return maxHorizontalCardDimensions.height;
  }

  if (appearance === 'square') {
    return maxSquareCardDimensions.height;
  }

  return maxSquareCardDimensions.width;
};

export const getCardMinWidth = (appearance?: CardAppearance) => {
  if (appearance === 'image') {
    return minImageCardDimensions.width;
  }

  if (appearance === 'horizontal') {
    return minHorizontalCardDimensions.width;
  }

  if (appearance === 'square') {
    return minSquareCardDimensions.width;
  }

  return minSmallCardDimensions.width;
};

export const getCardMaxWidth = (appearance?: CardAppearance) => {
  if (appearance === 'image') {
    return maxImageCardDimensions.width;
  }

  if (appearance === 'horizontal') {
    return maxHorizontalCardDimensions.width;
  }

  if (appearance === 'square') {
    return maxSquareCardDimensions.width;
  }

  return maxSquareCardDimensions.width;
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
