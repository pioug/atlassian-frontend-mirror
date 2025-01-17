// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSizeValue = gridSize();
const borderRadiusValue = borderRadius();

const tagHeightUnitless = 2.5 * gridSizeValue;
export const tagHeight = token('space.250', `${tagHeightUnitless}px`);
export const buttonWidthUnitless = tagHeightUnitless; // button should be square
const maxWidthUnitless = 25 * gridSizeValue;
export const maxTextWidthUnitless = maxWidthUnitless - tagHeightUnitless;
export const maxTextWidth = `${maxTextWidthUnitless}px`;

export const defaultBorderRadius = `${borderRadiusValue}px`;
export const defaultRoundedBorderRadius = `${buttonWidthUnitless / 2}px`;
export const defaultMargin = token('space.050', `${gridSizeValue / 2}px`);
// To be removed with platform-component-visual-refresh (BLU-2992)
export const defaultTextPadding = token('space.050', `${gridSizeValue / 2}px`);
export const textPaddingRight = token('space.200', `${2 * gridSizeValue}px`);
export const textMarginLeft = tagHeight;

export const cssVar = {
	color: {
		background: {
			default: '--ds-cb',
			hover: '--ds-cbh',
			active: '--ds-cba',
		},
		borderColor: '--ds-bc',
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
