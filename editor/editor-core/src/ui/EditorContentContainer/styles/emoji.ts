// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { defaultEmojiHeight, EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';
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
