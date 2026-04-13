// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { createTheme } from '@atlaskit/theme/components';

import { type ThemeProps, type ThemeTokens } from './custom-theme-button-types';
import { getCustomCss } from './get-custom-css';

const Theme: ReturnType<typeof createTheme<ThemeTokens, ThemeProps>> = createTheme<
	ThemeTokens,
	ThemeProps
>((themeProps) => ({
	buttonStyles: getCustomCss(themeProps),
	// No styles being applied directly to spinner by default
	// Keeping this for legacy compat. We could remove it, but given
	// that we are changing theme soon there is no point
	spinnerStyles: {},
}));

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Theme;
