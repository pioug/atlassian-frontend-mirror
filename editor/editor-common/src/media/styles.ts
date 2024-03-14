import { Y200, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export type CommentStatus = 'draft' | 'focus' | 'blur';

const boxShadowColorByStatus = {
  draft: token('color.background.accent.yellow.subtle', Y300),
  focus: token('color.background.accent.yellow.subtle', Y300),
  blur: token('color.background.accent.yellow.subtler', Y200),
};

export const commentStatusStyleMap = (status: CommentStatus) =>
  `3px 3px 0px 0px ${boxShadowColorByStatus[status]}`;
