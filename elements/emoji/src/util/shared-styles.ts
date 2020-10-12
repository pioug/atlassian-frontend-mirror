import { borderRadius } from '@atlaskit/theme/constants';
import { N40, N30 } from '@atlaskit/theme/colors';

import { emojiPickerWidth } from './constants';

export const emojiPickerListWidth = emojiPickerWidth;
export const emojiPickerListHeight = 205;

export const emojiPickerBorderColor = N40; // This has not been confirmed by the ADG yet
export const emojiPickerBoxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';
export const emojiFooterBoxShadow = '0px -1px 1px 0px rgba(0, 0, 0, 0.1)';

export const noDialogContainerBorderColor = N40; // This has not been confirmed by the ADG yet
export const noDialogContainerBorderRadius = `${borderRadius()}px`;
export const noDialogContainerBoxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';

export const akEmojiSelectedBackgroundColor = N30;
export const emojiPreviewSelectedColor = N30;

export const emojiTypeAheadMaxHeight = 350;
export const emojiTypeAheadWidth = 350;
