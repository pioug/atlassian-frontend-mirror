import { token } from '@atlaskit/tokens';

// TODO: This is where we need to add tokens for all appearance color values
export const getColorsFromAppearanceOldLogos = (
	appearance?: string,
	colorMode?: string,
): {
	iconGradientStart: string | undefined;
	iconGradientStop: string | undefined;
	iconColor: string | undefined;
	textColor: string | undefined;
	atlassianLogoTextColor: string | undefined;
} => {
	let iconGradientStart, iconGradientStop, iconColor, textColor, atlassianLogoTextColor;

	switch (appearance) {
		case 'brand':
			iconGradientStart = '#0052CC';
			iconGradientStop = '#2684FF';
			iconColor = '#2684FF';
			textColor = token('color.text');
			// This is only used for the top level Atlassian wordmark (see AtlassianLogo
			// or AtlassianStartLogo for example), and is only different for the Brand
			// appearance - a bold brand color. For other appearances,
			// atlassianLogoTextColor is the same as textColor.
			atlassianLogoTextColor = '#0052CC';
			break;
		case 'neutral':
			iconGradientStart = '#344563';
			iconGradientStop = '#7A869A';
			iconColor = '#7A869A';
			textColor = '#505F79';
			atlassianLogoTextColor = '#505F79';
			break;
		case 'inverse':
			iconGradientStart = '#FFFFFF66';
			iconGradientStop = '#FFFFFF';
			iconColor = '#FFFFFF';
			textColor = '#FFFFFF';
			atlassianLogoTextColor = '#FFFFFF';
			break;
	}
	if (colorMode === 'dark' && appearance === 'inverse') {
		iconGradientStart = '#161A1D66';
		iconGradientStop = '#161A1D';
		iconColor = '#161A1D';
		textColor = '#161A1D';
		atlassianLogoTextColor = '#161A1D';
	}
	return {
		iconGradientStart,
		iconGradientStop,
		iconColor,
		textColor,
		atlassianLogoTextColor,
	};
};

export const getColorsFromAppearance = (
	appearance?: string,
	colorMode?: string,
): {
	iconColor: string | undefined;
	textColor: string | undefined;
	atlassianLogoTextColor: string | undefined;
} => {
	let iconColor, textColor, atlassianLogoTextColor;

	if (colorMode === 'dark') {
		switch (appearance) {
			case 'brand':
				iconColor = '#357DE8';
				textColor = '#E2E3E4';
				atlassianLogoTextColor = '#357DE8';
				break;
			case 'neutral':
				iconColor = '#96999E';
				textColor = '#BFC1C4';
				atlassianLogoTextColor = '#96999E';
				break;
			case 'inverse':
				iconColor = '#101214';
				textColor = '#101214';
				atlassianLogoTextColor = '#101214';
				break;
		}
	} else {
		switch (appearance) {
			case 'brand':
				iconColor = '#1868DB';
				textColor = '#101214';
				atlassianLogoTextColor = '#1868DB';
				break;
			case 'neutral':
				iconColor = '#6C6F77';
				textColor = '#3B3D42';
				atlassianLogoTextColor = '#6C6F77';
				break;
			case 'inverse':
				iconColor = '#FFFFFF';
				textColor = '#FFFFFF';
				atlassianLogoTextColor = '#FFFFFF';
				break;
		}
	}

	return {
		iconColor,
		textColor,
		atlassianLogoTextColor,
	};
};

export const getColorsForLoom = (
	appearance?: string,
	colorMode?: string,
): {
	iconColor: string | undefined;
	textColor: string | undefined;
} => {
	let iconColor = getColorsFromAppearance(appearance, colorMode).iconColor;
	let textColor = getColorsFromAppearance(appearance, colorMode).textColor;
	if (colorMode === 'dark') {
		switch (appearance) {
			case 'brand':
				iconColor = '#625DF5';
				textColor = '#EFF0FF';
				break;
		}
	} else {
		switch (appearance) {
			case 'brand':
				iconColor = '#625DF5';
				textColor = '#252434';
				break;
		}
	}

	return {
		iconColor,
		textColor,
	};
};
