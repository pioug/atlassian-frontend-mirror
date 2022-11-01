import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSizeValue = gridSize();
const borderRadiusValue = borderRadius();
const fontSizeValue = fontSize();

export const tagHeightUnitless = 2.5 * gridSizeValue;
export const tagHeight = token('spacing.scale.250', `${tagHeightUnitless}px`);
export const buttonWidthUnitless = tagHeightUnitless; // button should be square
export const buttonWidth = tagHeight; // button should be square
export const maxWidthUnitless = 25 * gridSizeValue;
export const maxWidth = `${maxWidthUnitless}px`;
export const maxTextWidthUnitless = maxWidthUnitless - tagHeightUnitless;
export const maxTextWidth = `${maxTextWidthUnitless}px`;

export const defaultBorderRadius = `${borderRadiusValue}px`;
export const defaultRoundedBorderRadius = `${buttonWidthUnitless / 2}px`;
export const defaultMargin = token(
  'spacing.scale.050',
  `${gridSizeValue / 2}px`,
);
export const defaultTextPadding = token(
  'spacing.scale.050',
  `${gridSizeValue / 2}px`,
);
export const textPaddingRight = token(
  'spacing.scale.200',
  `${2 * gridSizeValue}px`,
);
export const textMarginLeft = tagHeight;
export const textFontSize = `${fontSizeValue}px`;

export const cssVar = {
  color: {
    background: {
      default: '--ds-cb',
      hover: '--ds-cbh',
      active: '--ds-cba',
    },
    focusRing: '--ds-cfr',
    text: {
      default: '--ds-ct',
      hover: '--ds-cth',
      active: '--ds-ctp',
      link: '--ds-ctl',
    },
    removeButton: {
      default: '--ds-rb',
      hover: '--ds-rbh',
    },
  },
  borderRadius: '--ds-br',
};
