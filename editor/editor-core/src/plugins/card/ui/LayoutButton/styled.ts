import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { B300, N300, N20A } from '@atlaskit/theme/colors';

export const toolbarButtonWrapper = css({
  background: `${token('color.background.neutral', N20A)}`,
  color: `${token('color.icon', N300)}`,
  ':hover': {
    background: `${token('color.background.neutral.hovered', B300)}`,
    color: `${token('color.icon', 'white')} !important`,
  },
});
