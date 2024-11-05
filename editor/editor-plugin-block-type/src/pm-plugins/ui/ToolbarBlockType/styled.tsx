/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const blockTypeMenuItemStyle = (
	tagName: string,
	selected?: boolean,
	typographyTheme?:
		| 'typography'
		| 'typography-adg3'
		| 'typography-modernized'
		| 'typography-refreshed',
) => {
	// TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
	const selectedStyle = selected
		? `${tagName} { color: ${token('color.text', 'white')} !important; }`
		: '';

	return () =>
		css(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			headingsSharedStyles(typographyTheme),
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'>': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					'h1, h2, h3, h4, h5, h6': {
						marginTop: 0,
					},
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			selectedStyle,
		);
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const keyboardShortcut = css(shortcutStyle, {
	marginLeft: token('space.200', '16px'),
	color: token('color.icon', N400),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const keyboardShortcutSelect = css({
	color: token('color.icon', N400),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperSmallStyle = css({
	marginLeft: token('space.050', '4px'),
	minWidth: '40px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const expandIconWrapperStyle = css({
	marginLeft: token('space.negative.100', '-8px'),
});
