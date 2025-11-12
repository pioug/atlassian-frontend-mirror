// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

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

import {
	blanketSelectionStyles,
	boxShadowSelectionStyles,
	dangerBackgroundStyles,
	dangerBorderStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

const emojiSelectionStyles = css({
	borderRadius: token('radius.xsmall'),
});

// Emoji node view styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const emojiStyles: SerializedStyles = css({
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
	[`.ProseMirror .${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: [
			emojiSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			blanketSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const scaledEmojiStyles = css({
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
	[`.ProseMirror .${akEditorSelectedNodeClassName}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: [
			emojiSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			blanketSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			boxShadowSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			hideNativeBrowserTextSelectionStyles,
		],
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h1 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH1}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH1}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h2 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH2}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH2}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h3 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH3}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH3}px`,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror h4 :is(.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${scaledEmojiHeightH4}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `${scaledEmojiHeightH4}px`,
		},
});

export const getScaledDenseEmojiStyles = (baseFontSize?: number): SerializedStyles => {
	if (!baseFontSize || baseFontSize === akEditorFullPageDefaultFontSize) {
		return css({});
	}

	return css({
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
			height: token('space.250', '20px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			width: token('space.250', '20px'),
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
	});
};

/**
 * Gets dynamic emoji styles that scale emoji size based on the base font size.
 * This allows emojis to scale proportionally when the base font size changes.
 * @param baseFontSize - The base font size in pixels (e.g., 16 for default, 13 for dense mode)
 * @returns SerializedStyles with emoji size overrides if baseFontSize is provided and different from default.
 */
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
			height: token('space.250', '20px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			width: token('space.250', '20px'),
		},
	});
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const emojiDangerStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.ProseMirror .${akEditorSelectedNodeClassName}.danger`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: [
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
			[dangerBorderStyles, dangerBackgroundStyles],
		],
	},
});
