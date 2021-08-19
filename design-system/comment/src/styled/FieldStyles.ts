import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface CommonProps {
  hasAuthor?: boolean;
}
const common = ({ hasAuthor }: CommonProps) => css`
  &:not(:hover):not(:active) {
    color: ${token('color.text.mediumEmphasis', N500)};
  }
  font-weight: ${hasAuthor ? 500 : 'inherit'};
`;

export const Anchor = styled.a<CommonProps>`
  ${(p) => common(p)};
`;
export const Span = styled.span<CommonProps>`
  ${(p) => common(p)};
`;
