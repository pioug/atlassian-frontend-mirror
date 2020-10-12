/** @jsx jsx */

import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const ArticleFeedbackContainer = styled.div`
  position: relative;
`;

export const ArticleFeedbackText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${colors.N200};
  line-height: ${gridSize() * 4}px;
  position: relative;
  display: inline-block;
`;

export const ArticleFeedbackAnswerWrapper = styled.div`
  padding-top: ${gridSize() * 2}px;
`;
