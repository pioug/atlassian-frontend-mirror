import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { N40, N30 } from '@atlaskit/theme/colors';

import { emojiPickerWidth } from './constants';

export const emojiPickerListWidth = emojiPickerWidth;
export const emojiPickerListHeight = 205;

export const emojiPickerBorderColor = token('color.border.neutral', N40);
export const emojiPickerBoxShadow = token(
  'shadow.overlay',
  '0 3px 6px rgba(0, 0, 0, 0.2)',
);
export const noDialogContainerBorderColor = token('color.border.neutral', N40);
export const noDialogContainerBorderRadius = `${borderRadius()}px`;
export const noDialogContainerBoxShadow = token(
  'shadow.overlay',
  '0 3px 6px rgba(0, 0, 0, 0.2)',
);

export const akEmojiSelectedBackgroundColor = token(
  'color.background.transparentNeutral.hover',
  N30,
);
export const emojiPreviewSelectedColor = token(
  'color.background.subtleNeutral.resting',
  N30,
);

export const emojiTypeAheadMaxHeight = 350;
export const emojiTypeAheadWidth = 350;
