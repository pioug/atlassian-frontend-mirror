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
