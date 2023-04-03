import { token } from '@atlaskit/tokens';
import { N40, N30 } from '@atlaskit/theme/colors';

import { emojiPickerWidth } from './constants';

export const emojiPickerListWidth = emojiPickerWidth;
export const emojiPickerListHeight = 205;

export const emojiPickerBorderColor = token('color.border', N40);
export const emojiPickerBoxShadow = token(
  'elevation.shadow.overlay',
  '0 3px 6px rgba(0, 0, 0, 0.2)',
);
export const noDialogContainerBorderColor = token('color.border', N40);
export const noDialogContainerBorderRadius = token('border.radius.100', '3px');
export const noDialogContainerBoxShadow = token(
  'elevation.shadow.overlay',
  '0 3px 6px rgba(0, 0, 0, 0.2)',
);

export const akEmojiSelectedBackgroundColor = token(
  'color.background.neutral.subtle.hovered',
  N30,
);
export const emojiPreviewSelectedColor = token('color.background.neutral', N30);

export const emojiTypeAheadMaxHeight = 350;
export const emojiTypeAheadWidth = 350;
