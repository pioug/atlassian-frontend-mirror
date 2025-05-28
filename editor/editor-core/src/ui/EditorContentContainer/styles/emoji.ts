// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { defaultEmojiHeight, EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { akEditorSelectedNodeClassName } from '@atlaskit/editor-shared-styles';

import {
	blanketSelectionStyles,
	boxShadowSelectionStyles,
	hideNativeBrowserTextSelectionStyles,
} from './selectionStyles';

const reactEmojiSelectionStyles = css({
	borderRadius: '2px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const reactEmojiStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`.${EmojiSharedCssClassName.EMOJI_CONTAINER}`]: {
		display: 'inline-block',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_NODE}`]: {
			cursor: 'pointer',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`&.${EmojiSharedCssClassName.EMOJI_IMAGE} > span`]: {
				/** needed for selection style to cover custom emoji image properly */
				display: 'flex',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`&.${akEditorSelectedNodeClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: [
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blanketSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
				reactEmojiSelectionStyles,
			],
		},
	},
});

const vanillaEmojiSelectionStyles = css({
	borderRadius: '2px',
});

// Emoji styles from Emoji vanilla node view
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const vanillaEmojiStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-prosemirror-node-view-type="vanilla"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_CONTAINER}`]: {
			display: 'inline-block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: {
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
		[`&.${akEditorSelectedNodeClassName}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${EmojiSharedCssClassName.EMOJI_SPRITE}, .${EmojiSharedCssClassName.EMOJI_IMAGE}`]: [
				vanillaEmojiSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				blanketSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				hideNativeBrowserTextSelectionStyles,
			],
		},
	},
});
