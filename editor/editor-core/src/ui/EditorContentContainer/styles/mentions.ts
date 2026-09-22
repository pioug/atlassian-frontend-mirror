/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */

import { css, keyframes } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

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
	dangerBackgroundStyles,
	dangerBorderStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

/* need to specify dark text colour because personal mentions
(in dark blue) have white text by default */
const mentionsSelectedColor = css({
	color: token('color.text.subtle'),
});

const mentionRunShimmer = keyframes({
	from: { backgroundPosition: '200% 0' },
	to: { backgroundPosition: '-200% 0' },
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const mentionsStyles: SerializedStyles = css({
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
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const mentionNodeStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Scoped to mention node view helpers.
	'.mentionNodeViewAddZeroWidthSpace': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Add a CSS-escaped zero-width space after the helper.
		'&::after': {
			content: "'\\200B'",
		},
	},

	// Show diff: mention attr change highlight. Keep this with mention node styles so the
	// highlight targets the mention primitive's rounded shape.
	// The ON cohort of platform_editor_show_diff_color_scheme_refactor sets
	// --show-diff-atomic-inline-changed-border-color inline, overriding the table below; the OFF
	// cohort picks its colour with the `-traditional` class. Drop the table at cleanup (EDITOR-8281).
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.show-diff-atomic-inline-changed-mention': {
		'--show-diff-atomic-inline-changed-border-color': token('color.border.accent.purple'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.show-diff-atomic-inline-changed-mention.show-diff-atomic-inline-changed-traditional': {
		'--show-diff-atomic-inline-changed-border-color': token('color.border.accent.green'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.show-diff-atomic-inline-changed-mention .editor-mention-primitive': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		boxShadow: `0 0 0 2px var(--show-diff-atomic-inline-changed-border-color, ${token('color.border.accent.purple')})`,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive': {
		display: 'inline',
		borderRadius: token('radius.full'),
		cursor: 'pointer',
		padding: '1px 0.3em 1px 0.23em',
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

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Vanilla mention NodeView styles are scoped under the editor container.
	'.editor-mention-primitive-with-avatar': {
		padding: '1px 0.3em 1px 0.23em',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Vanilla mention NodeView styles are scoped under the editor container.
	'.editor-mention-avatar': {
		display: 'inline-flex',
		// Track the inherited mention text size so avatars remain proportional in headings.
		width: '1em',
		height: '1em',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		marginInlineEnd: token('space.050'),
		overflow: 'hidden',
		borderRadius: token('radius.full'),
		verticalAlign: '-0.125em',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Vanilla mention NodeView styles are scoped under the editor container.
	'.editor-mention-avatar-fallback': {
		verticalAlign: '0.05em',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Vanilla mention NodeView styles are scoped under the editor container.
	'.editor-mention-avatar-agent': {
		borderRadius: 0,
		clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Vanilla mention NodeView styles are scoped under the editor container.
	'.editor-mention-avatar-image': {
		display: 'block',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
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

	// Disabled variant — mirrors `MentionType.DISABLED` in
	// `packages/elements/mention/src/components/Mention/PrimitiveMention.tsx`.
	// Hover / active states are intentionally flat: a disabled chip should
	// not respond to mouse interaction. The chip is still keyboard-focusable
	// (see `MentionNodeView.setClassList`) so the focus ring is still
	// allowed to render via `:focus-visible`.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.editor-mention-primitive.mention-disabled': {
		background: token('color.background.disabled'),
		border: '1px solid transparent',
		color: token('color.text.disabled'),
		cursor: 'default',

		'&:hover': {
			background: token('color.background.disabled'),
		},
		'&:active': {
			background: token('color.background.disabled'),
		},
	},

	// Agent mention run-state styles. The 'analysing' state changes the chip/text to a shimmer, other
	// states will still render the default chip/text.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.agent-mention-analysing-state .editor-mention-primitive': {
		// Light mode variant
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values
		backgroundImage: `linear-gradient(90deg, #EBEBEB 35%, ${token(
			'elevation.surface.hovered',
		)} 45%, ${token('elevation.surface.hovered')} 55%, #EBEBEB 65%)`,
		backgroundSize: '200% 100%',
		animationName: mentionRunShimmer,
		animationDuration: '2.5s',
		animationIterationCount: 'infinite',
		animationTimingFunction: 'linear',
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},

		// Dark mode override for the agent mention pill shimmer
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'html[data-color-mode=dark] &': {
			backgroundImage: `linear-gradient(90deg, ${token('elevation.surface.pressed')} 35%, ${token(
				'elevation.surface.raised',
			)} 45%, ${token('elevation.surface.raised')} 55%, ${token('elevation.surface.pressed')} 65%)`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.agent-mention-analysing-state .editor-mention-text': {
		backgroundImage: `linear-gradient(90deg, ${token('color.text')} 35%, ${token(
			'color.text.subtle',
		)} 45%, ${token('color.background.accent.gray.subtler.hovered')} 50%, ${token(
			'color.text.subtle',
		)} 55%, ${token('color.text')} 65%)`,
		backgroundSize: '200% 100%',
		WebkitBackgroundClip: 'text',
		backgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		color: 'transparent',
		animationName: mentionRunShimmer,
		animationDuration: '2.5s',
		animationIterationCount: 'infinite',
		animationTimingFunction: 'linear',
		'@media (prefers-reduced-motion: reduce)': {
			animation: 'none',
		},
	},
});

// This is mentions styles for mentions selection styles based on the vanilla node view
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const mentionsSelectionStyles: SerializedStyles = css({
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
	[`.${akEditorSelectedNodeClassName}:not(.search-match-block)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
			],
	},
});
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const mentionDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${akEditorSelectedNodeClassName}:not(.search-match-block).danger`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values,
			[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				dangerBorderStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				dangerBackgroundStyles,
			],
	},
});
