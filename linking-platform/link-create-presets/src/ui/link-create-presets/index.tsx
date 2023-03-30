/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { B400, B50, B75, N20, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { LinkCreatePresetsProps } from './types';

const containerStyles = css({
  padding: '8px',
  border: '1px solid',
  borderRadius: '4px',
});

const unselectedStyles = css({
  borderColor: token('color.border', N50),
  ':hover': {
    backgroundColor: token('color.background.neutral.hovered', N20),
  },
});

const selectedStyles = css({
  backgroundColor: token('color.background.selected', B50),
  borderColor: token('color.border.selected', B400),
  color: token('color.text.selected', B400),
  ':hover': {
    backgroundColor: token('color.background.selected.hovered', B75),
  },
});

export default function LinkCreatePresets({
  isSelected,
  testId,
  width,
}: LinkCreatePresetsProps) {
  return (
    <div
      style={{ width }}
      css={[containerStyles, isSelected ? selectedStyles : unselectedStyles]}
      data-testid={testId}
    >
      Hello world
    </div>
  );
}
