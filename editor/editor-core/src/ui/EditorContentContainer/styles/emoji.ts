/* eslint-disable @atlaskit/ui-styling-standard/use-compiled,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import {
	defaultEmojiHeight,
	EmojiSharedCssClassName,
	defaultDenseEmojiHeight,
	scaledEmojiHeightH1,
	scaledEmojiHeightH2,
	scaledEmojiHeightH3,
	scaledEmojiHeightH4,
	denseEmojiHeightH1,
	denseEmojiHeightH2,
	denseEmojiHeightH3,
	denseEmojiHeightH4,
} from '@atlaskit/editor-common/emoji';
import {
	akEditorFullPageDefaultFontSize,
	akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// Emoji node view styles
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
export const emojiStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${defaultEmojiHeight}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h1 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH1}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h2 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH2}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h3 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH3}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h4 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH4}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror :is(h5, h6, p) [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${defaultEmojiHeight}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${EmojiSharedCssClassName.EMOJI_CONTAINER}`]: {
		display: 'inline-block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			background: 'no-repeat transparent',
			display: 'inline-block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${defaultEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			maxHeight: `${defaultEmojiHeight}px`,
			cursor: 'pointer',
			verticalAlign: 'middle',
			userSelect: 'all',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${EmojiSharedCssClassName.EMOJI_UNICODE}`]: {
		cursor: 'pointer',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_UNICODE}`]:
			{
				borderRadius: token('radius.xsmall'),
				position: 'relative',
				WebkitUserSelect: 'text',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				borderColor: 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::selection,*::selection': {
					backgroundColor: 'transparent',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::-moz-selection,*::-moz-selection': {
					backgroundColor: 'transparent',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::before': {
					position: 'absolute',
					content: "''",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					width: '100%',
					pointerEvents: 'none',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					zIndex: 12,
					backgroundColor: token('color.blanket.selected'),
				},
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
export const scaledEmojiStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${defaultEmojiHeight}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h1 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH1}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h2 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH2}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h3 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH3}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror h4 [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${scaledEmojiHeightH4}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror :is(h5, h6, p) [data-emoji-type="unicode"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--emoji-common-unicode-size': `${defaultEmojiHeight}px`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${EmojiSharedCssClassName.EMOJI_CONTAINER}`]: {
		display: 'inline-block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			background: 'no-repeat transparent',
			display: 'inline-block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${defaultEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			minHeight: `${defaultEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			minWidth: `${defaultEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			maxHeight: `${scaledEmojiHeightH1}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			maxWidth: `${scaledEmojiHeightH1}px`,
			cursor: 'pointer',
			verticalAlign: 'middle',
			userSelect: 'all',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${EmojiSharedCssClassName.EMOJI_UNICODE}`]: {
		cursor: 'pointer',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_UNICODE}`]:
			{
				borderRadius: token('radius.xsmall'),
				position: 'relative',
				WebkitUserSelect: 'text',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				borderColor: 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::selection,*::selection': {
					backgroundColor: 'transparent',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::-moz-selection,*::-moz-selection': {
					backgroundColor: 'transparent',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'&::before': {
					position: 'absolute',
					content: "''",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					width: '100%',
					pointerEvents: 'none',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					zIndex: 12,
					backgroundColor: token('color.blanket.selected'),
				},
			},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h1 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH1}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH1}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h2 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH2}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH2}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h3 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH3}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH3}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h4 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH4}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH4}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-selectors
	[`.ProseMirror :is(h5, h6, p) .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height: `${defaultEmojiHeight}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		width: `${defaultEmojiHeight}px`,
	},
});

/**
 * Gets scaled dense emoji styles that adjust emoji sizes for dense mode headings.
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getScaledDenseEmojiStyles = (baseFontSize?: number): SerializedStyles => {
	if (!baseFontSize || baseFontSize === akEditorFullPageDefaultFontSize) {
		return css({});
	}

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${defaultDenseEmojiHeight}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h1 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH1}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h2 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH2}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h3 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH3}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h4 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH4}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror :is(h5, h6, p) [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${defaultDenseEmojiHeight}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				width: defaultDenseEmojiHeight,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: defaultDenseEmojiHeight,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				minHeight: defaultDenseEmojiHeight,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				minWidth: defaultDenseEmojiHeight,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				maxHeight: `${denseEmojiHeightH1}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				maxWidth: `${denseEmojiHeightH1}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				img: {
					width: '100%',
					height: '100%',
					objectFit: 'contain',
				},
			},
		// Scale panel icon in dense mode
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .ak-editor-panel .ak-editor-panel__icon': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height: token('space.250'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			width: token('space.250'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h1 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: `${denseEmojiHeightH1}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				width: `${denseEmojiHeightH1}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h2 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: `${denseEmojiHeightH2}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				width: `${denseEmojiHeightH2}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h3 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: `${denseEmojiHeightH3}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				width: `${denseEmojiHeightH3}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h4 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: `${denseEmojiHeightH4}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				width: `${denseEmojiHeightH4}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h1 .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${denseEmojiHeightH1}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${denseEmojiHeightH1}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h2 .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${denseEmojiHeightH2}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${denseEmojiHeightH2}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h3 .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${denseEmojiHeightH3}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${denseEmojiHeightH3}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror h4 .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${denseEmojiHeightH4}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${denseEmojiHeightH4}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-selectors
		[`.ProseMirror :is(h5, h6, p) .${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${defaultDenseEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${defaultDenseEmojiHeight}px`,
		},
	});
};

/**
 * Gets dynamic emoji styles that scale emoji size based on the base font size.
 * This allows emojis to scale proportionally when the base font size changes.
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 * @param baseFontSize - The base font size in pixels (e.g., 16 for default, 13 for dense mode)
 * @returns SerializedStyles with emoji size overrides if baseFontSize is provided and different from default.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getDenseEmojiStyles = (baseFontSize?: number): SerializedStyles => {
	if (!baseFontSize || baseFontSize === akEditorFullPageDefaultFontSize) {
		return css({});
	}

	// Calculate emoji size based on base font size
	// Default: 20px emoji at 16px base font
	// Scaled: 20px * (baseFontSize/16)
	// E.g., dense mode (13px base): 20px * (13/16) = 16.25px
	const emojiSize = (defaultEmojiHeight * baseFontSize) / akEditorFullPageDefaultFontSize;

	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${defaultDenseEmojiHeight}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h1 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH1}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h2 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH2}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h3 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH3}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror h4 [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${denseEmojiHeightH4}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror :is(h5, h6, p) [data-emoji-type="unicode"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--emoji-common-unicode-size': `${defaultDenseEmojiHeight}px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.ProseMirror :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				width: emojiSize,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: emojiSize,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				maxHeight: emojiSize,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				img: {
					width: '100%',
					height: '100%',
					objectFit: 'contain',
				},
			},
		// Scale panel icon in dense mode
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .ak-editor-panel .ak-editor-panel__icon': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height: token('space.250'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			width: token('space.250'),
		},
	});
};
/**
 * @deprecated This style has been migrated to Compiled CSS, under experiment platform_editor_core_static_css
 * If you need to make changes here, also update the corresponding style in
 * packages/editor/editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx
 * See EDITOR-7600 for more details: https://hello.jira.atlassian.cloud/jira/browse/EDITOR-7600
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/volt-strict-mode/no-multiple-exports
export const emojiDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${akEditorSelectedNodeClassName}.danger`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}, .${EmojiSharedCssClassName.EMOJI_UNICODE}`]:
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},
	},
});
