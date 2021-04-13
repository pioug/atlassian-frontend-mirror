import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';

const gridSizeValue = gridSize();
const borderRaidusValue = borderRadius();
const fontSizeValue = fontSize();

export const tagHeightUnitless = 2.5 * gridSizeValue;
export const tagHeight = `${tagHeightUnitless}px`;
export const buttonWidthUnitless = tagHeightUnitless; // button should be square
export const buttonWidth = tagHeight; // button should be square
export const maxWidthUnitless = 25 * gridSizeValue;
export const maxWidth = `${maxWidthUnitless}px`;
export const maxTextWidthUnitless = maxWidthUnitless - tagHeightUnitless;
export const maxTextWidth = `${maxTextWidthUnitless}px`;

export const defaultBorderRadius = `${borderRaidusValue}px`;
export const defaultRoundedBorderRadius = `${buttonWidthUnitless / 2}px`;
export const defaultMargin = `${gridSizeValue / 2}px`;
export const defaultTextPadding = `${gridSizeValue / 2}px`;
export const textPaddingRight = `${2 * gridSizeValue}px`;
export const textMarginLeft = `${tagHeightUnitless}px`;
export const textFontSize = `${fontSizeValue}px`;
