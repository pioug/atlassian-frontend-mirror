import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { token } from '@atlaskit/tokens';

import {
	backgroundSelectionStyles,
	borderSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

export const UnsupportedSharedCssClassName = {
	BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
	INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const unsupportedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, .${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
		{
			cursor: 'pointer',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-selected-node': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				borderSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`&.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div, &.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`]:
				{
					border: `1px solid ${token('color.border.danger')}`,
					backgroundColor: token('color.blanket.danger'),
				},
		},
	},
});
