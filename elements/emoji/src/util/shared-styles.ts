import { token } from '@atlaskit/tokens';

import { emojiPickerWidth } from './constants';

export const emojiPickerListWidth: 350 = emojiPickerWidth;
export const emojiPickerListHeight = 205;

export const emojiPickerBorderColor: 'var(--ds-border)' = token('color.border');
export const emojiPickerBoxShadow: 'var(--ds-shadow-overlay)' = token('elevation.shadow.overlay');
export const noDialogContainerBorderColor: 'var(--ds-border)' = token('color.border');
export const noDialogContainerBorderRadius: 'var(--ds-radius-small)' = token('radius.small', '3px');
export const noDialogContainerBoxShadow: 'var(--ds-shadow-overlay)' = token(
	'elevation.shadow.overlay',
);

export const akEmojiSelectedBackgroundColor: 'var(--ds-background-neutral-subtle-hovered)' = token(
	'color.background.neutral.subtle.hovered',
);
export const emojiPreviewSelectedColor: 'var(--ds-background-neutral)' = token(
	'color.background.neutral',
);

export const emojiTypeAheadMaxHeight: EmojiTypeAheadMaxHeight = 350;
export const emojiTypeAheadWidth: EmojiTypeAheadWidth = 350;

export type EmojiTypeAheadWidth = 350;
export type EmojiTypeAheadMaxHeight = 350;
