/** @jsx jsx */

import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ArticleFeedbackContainer = styled.div`
  position: relative;
`;

export const ArticleFeedbackText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${token('color.text.subtlest', colors.N200)};
  line-height: ${token('font.lineHeight.500', '32px')};
  position: relative;
  display: inline-block;
`;

export const ArticleFeedbackAnswerWrapper = styled.div`
  padding-top: ${token('space.200', '16px')};
`;
