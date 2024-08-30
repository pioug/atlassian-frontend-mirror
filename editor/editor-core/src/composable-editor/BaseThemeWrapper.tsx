import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from '@emotion/react';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

type BaseThemeProps = {
	children: React.ReactNode;
	baseFontSize?: number;
};

// Default value from: `import { fontSize } from '@atlaskit/theme/constants';`
const defaultFontSize = 14;

export function BaseThemeWrapper({ baseFontSize, children }: BaseThemeProps) {
	const memoizedTheme = useMemo(
		() => ({
			baseFontSize: baseFontSize || defaultFontSize,
			layoutMaxWidth: akEditorDefaultLayoutWidth,
		}),
		[baseFontSize],
	);

	return <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>;
}
