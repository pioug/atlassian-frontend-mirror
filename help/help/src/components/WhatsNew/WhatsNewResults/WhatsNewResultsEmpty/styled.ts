/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const WhatsNewResultsEmptyMessageImage = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;
`;

export const WhatsNewResultsEmptyMessageText = styled.div`
  padding: ${3 * gridSize()}px ${3 * gridSize()}px 0 ${3 * gridSize()}px;
  text-align: center;

  p {
    color: ${token('color.text.subtlest', colors.N200)};
  }
`;
