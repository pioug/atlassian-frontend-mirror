import { Breakpoint, getTitleBoxHeight, responsiveSettings } from '../common';

// %
const smallSizeSettings = { marginBottom: 4 };

const largeSizeSettings = { marginBottom: 12 };

export function generateResponsiveStyles(
	breakpoint: Breakpoint,
	positionBottom: boolean,
	showOnTop: boolean,
	multiplier: number = 1,
) {
	const setting = breakpoint === Breakpoint.SMALL ? smallSizeSettings : largeSizeSettings;
	const marginPositionBottom = responsiveSettings[breakpoint].titleBox.verticalPadding;
	const marginBottom =
		setting.marginBottom * multiplier +
		(positionBottom ? marginPositionBottom : getTitleBoxHeight(breakpoint));
	return `
    ${showOnTop ? 'top' : 'bottom'}: ${marginBottom}px
  `;
}
