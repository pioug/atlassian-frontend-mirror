import styled from '@emotion/styled';

import { N100A, N800 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const Content = styled.div<{ isDisabled?: boolean }>`
  color: ${({ isDisabled }) =>
    isDisabled
      ? token('color.text.disabled', N100A)
      : token('color.text.highEmphasis', N800)};
  margin-top: ${gridSize() / 2}px;
`;
