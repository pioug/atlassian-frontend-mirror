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
