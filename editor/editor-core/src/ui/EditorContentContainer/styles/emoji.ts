// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { defaultEmojiHeight, EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
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
