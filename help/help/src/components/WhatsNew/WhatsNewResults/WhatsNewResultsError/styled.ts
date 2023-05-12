/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const SearchResultEmptyMessageImage = styled.div`
  padding: ${token('space.300', '24px')} ${token('space.300', '24px')} 0
    ${token('space.300', '24px')};
  text-align: center;
`;

export const SearchResultEmptyMessageText = styled.div`
  padding: ${token('space.300', '24px')} ${token('space.300', '24px')} 0
    ${token('space.300', '24px')};
  text-align: center;

  p {
    color: ${token('color.text.subtlest', colors.N200)};
  }
`;
