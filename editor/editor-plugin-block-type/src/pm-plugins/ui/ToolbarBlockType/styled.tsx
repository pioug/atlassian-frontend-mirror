/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { headingsSharedStyles, blockquoteSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { token, type ThemeState } from '@atlaskit/tokens';

export const blockTypeMenuItemStyle = (
	tagName: string,
	selected?: boolean,
	typographyTheme?: ThemeState['typography'],
) => {
	// TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
	const selectedStyle = selected ? `${tagName} { color: ${token('color.text')} !important; }` : '';

	return (): SerializedStyles =>
		css(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			tagName === 'blockquote' ? blockquoteSharedStyles : headingsSharedStyles(typographyTheme),
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'>': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					'h1, h2, h3, h4, h5, h6': {
						marginTop: 0,
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					blockquote: {
						paddingTop: 0,
						paddingBottom: 0,
						marginTop: 0,
					},
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			selectedStyle,
		);
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const keyboardShortcut: SerializedStyles = css(shortcutStyle, {
	marginLeft: token('space.200'),
	color: token('color.icon'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const keyboardShortcutSelect: SerializedStyles = css({
	color: token('color.icon'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperSmallStyle: SerializedStyles = css({
	marginLeft: token('space.050'),
	minWidth: '40px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const expandIconWrapperStyle: SerializedStyles = css({
	marginLeft: token('space.negative.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const floatingToolbarWrapperStyle: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-role='droplistContent']": {
		maxHeight: '90vh',
	},
});
