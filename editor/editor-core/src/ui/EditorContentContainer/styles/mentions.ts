// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import {
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import {
	backgroundSelectionStyles,
	boxShadowSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/* need to specify dark text colour because personal mentions
(in dark blue) have white text by default */
const mentionsSelectedColor = css({
	color: token('color.text.subtle'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mentionsStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${MentionSharedCssClassName.MENTION_CONTAINER}`]: {
		// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`&.${akEditorSelectedNodeClassName} [data-mention-id] > span`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			backgroundSelectionStyles,
			mentionsSelectedColor,
		],
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${MentionSharedCssClassName.MENTION_CONTAINER}.${akEditorSelectedNodeClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> span > span > span': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder}`,
				backgroundColor: token('color.background.danger'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${MentionSharedCssClassName.MENTION_CONTAINER} > span > span > span`]: {
			backgroundColor: token('color.background.neutral'),
			color: token('color.text.subtle'),
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mentionNodeStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		display: 'inline',
		borderRadius: '20px',
		cursor: 'pointer',
		padding: '0 0.3em 2px 0.23em',
		// To match `packages/elements/mention/src/components/Mention/PrimitiveMention.tsx` implementation
		// we match the line height exactly
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.714',
		fontWeight: token('font.weight.regular'),
		wordBreak: 'break-word',
		background: token('color.background.neutral'),
		border: '1px solid transparent',
		color: token('color.text.subtle'),

		'&:hover': {
			background: token('color.background.neutral.hovered'),
		},
		'&:active': {
			background: token('color.background.neutral.pressed'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive.mention-restricted': {
		background: 'transparent',
		border: `1px solid ${token('color.border.bold')}`,
		color: token('color.text'),

		'&:hover': {
			background: 'transparent',
		},
		'&:active': {
			background: 'transparent',
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive.mention-self': {
		background: token('color.background.brand.bold'),
		border: '1px solid transparent',
		color: token('color.text.inverse'),

		'&:hover': {
			background: token('color.background.brand.bold.hovered'),
		},
		'&:active': {
			background: token('color.background.brand.bold.pressed'),
		},
	},
});

// The feature-gate for this is dependent on the use of refreshed typography - bear this in mind when cleaning up
// This is currently enforced through statsig prerequisite gates, as per #help-afm recommendation.
// So it will need to be considered if the typography gates are still in use when this is cleaned up.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mentionsStylesMixin_platform_editor_centre_mention_padding = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		padding: '1px 0.3em 1px 0.23em',
	},
});

// This is mentions styles for mentions selection styles based on the vanilla node view
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mentionsSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.editor-mention-primitive': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder}`,
			backgroundColor: token('color.background.danger'),
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
				mentionsSelectedColor,
			],
	},
});

// This is mentions styles for mentions selection styles based on the vanilla node view
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const mentionsSelectionStylesWithSearchMatch = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.danger': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.editor-mention-primitive': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder}`,
			backgroundColor: token('color.background.danger'),
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
				mentionsSelectedColor,
			],
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${akEditorSelectedNodeClassName}:not('.search-match-block')`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],
	},
});
