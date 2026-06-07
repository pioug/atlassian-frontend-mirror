import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from '@emotion/react';

import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type BaseThemeProps = {
	baseFontSize?: number;
	children: React.ReactNode;
};

// Default value from: `import { fontSize } from '@atlaskit/theme/constants';`
const defaultFontSize = 14;

// No-op variant used when the static-css experiment is enabled. Editor consumers
// no longer read theme.baseFontSize / theme.layoutMaxWidth via Emotion's useTheme(),
// so no <ThemeProvider> is required in the React tree.
const BaseThemeWrapperNoop = ({ children }: BaseThemeProps): React.JSX.Element => <>{children}</>;

// Legacy variant keeping the original Emotion <ThemeProvider> behaviour for
// callers that still rely on theme.baseFontSize / theme.layoutMaxWidth.
const BaseThemeWrapperLegacy = ({ baseFontSize, children }: BaseThemeProps): React.JSX.Element => {
	const memoizedTheme = useMemo(
		() => ({
			baseFontSize: baseFontSize || defaultFontSize,
			layoutMaxWidth: akEditorDefaultLayoutWidth,
		}),
		[baseFontSize],
	);

	return <ThemeProvider theme={memoizedTheme}>{children}</ThemeProvider>;
};

// Gated at module load — when the experiment is enabled, this becomes a no-op
// wrapper; otherwise it preserves today's Emotion <ThemeProvider> behaviour.
export const BaseThemeWrapper: React.ComponentType<BaseThemeProps> = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	BaseThemeWrapperNoop,
	BaseThemeWrapperLegacy,
);
