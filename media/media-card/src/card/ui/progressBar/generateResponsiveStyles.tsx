/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Breakpoint, getTitleBoxHeight, responsiveSettings } from '../common';

// %
const smallSizeSettings = { marginBottom: 4 };

const largeSizeSettings = { marginBottom: 12 };

export function generateResponsiveStyles(
	breakpoint: Breakpoint,
	positionBottom: boolean,
	showOnTop: boolean,
	multiplier: number = 1,
):
	| {
			top: string;
			bottom?: undefined;
	  }
	| {
			bottom: string;
			top?: undefined;
	  } {
	const setting = breakpoint === Breakpoint.SMALL ? smallSizeSettings : largeSizeSettings;
	const marginPositionBottom = responsiveSettings[breakpoint].titleBox.verticalPadding;
	const marginBottom =
		setting.marginBottom * multiplier +
		(positionBottom ? marginPositionBottom : getTitleBoxHeight(breakpoint));
	const spacing = `${marginBottom}px`;

	return showOnTop ? { top: spacing } : { bottom: spacing };
}
