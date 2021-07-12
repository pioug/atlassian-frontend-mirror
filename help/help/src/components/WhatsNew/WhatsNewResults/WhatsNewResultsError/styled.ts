/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const SearchResultEmptyMessageImage = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;
`;

export const SearchResultEmptyMessageText = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;

  p {
    color: ${colors.N200};
  }
`;
