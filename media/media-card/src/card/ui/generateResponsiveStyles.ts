import { Breakpoint, responsiveSettings } from './common';

export const generateResponsiveStyles = (breakpoint: Breakpoint = Breakpoint.SMALL) => {
	const setting = responsiveSettings[breakpoint];
	return `
    font-size: ${setting.fontSize}px;
    line-height: ${setting.lineHeight}px;
  `;
};
