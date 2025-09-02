// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
	boxShadowSelectionStyles,
	dangerBorderStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

export const DateSharedCssClassName = {
	DATE_WRAPPER: `date-lozenger-container`,
	DATE_CONTAINER: 'dateView-content-wrap',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dateVanillaStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		borderRadius: token('radius.small'),
		padding: `${token('space.025')} ${token('space.050')}`,
		margin: '0 1px',
		position: 'relative',
		transition: 'background 0.3s',
		whiteSpace: 'nowrap',
		cursor: 'unset',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span:hover`]: {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span.date-node-color-red`]:
		{
			backgroundColor: token('color.background.accent.red.subtlest'),
			color: token('color.text.accent.red'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`[data-prosemirror-node-name='date'] .${DateSharedCssClassName.DATE_WRAPPER} span.date-node-color-red:hover`]:
		{
			backgroundColor: token('color.background.accent.red.subtler'),
		},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dateStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		whiteSpace: 'unset',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${DateSharedCssClassName.DATE_CONTAINER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${DateSharedCssClassName.DATE_WRAPPER}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'initial',
			cursor: 'pointer',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${DateSharedCssClassName.DATE_WRAPPER} > span`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${DateSharedCssClassName.DATE_CONTAINER}.ak-editor-selected-node .${DateSharedCssClassName.DATE_WRAPPER} > span`]:
			{
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
			},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const dangerDateStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
	[`.${DateSharedCssClassName.DATE_CONTAINER}.ak-editor-selected-node.danger .${DateSharedCssClassName.DATE_WRAPPER} > span`]:
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[dangerBorderStyles],
});
