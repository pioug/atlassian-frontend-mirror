/** @jsx jsx */

import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ArticleFeedbackContainer = styled.div({
  position: 'relative',
});

export const ArticleFeedbackText = styled.div({
  font: token(
    'font.heading.xxsmall',
    'normal 600 0.75rem/1rem ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  color: token('color.text.subtlest', colors.N200),
  position: 'relative',
  display: 'inline-block',
});

export const ArticleFeedbackAnswerWrapper = styled.div({
  paddingTop: token('space.200', '16px'),
});
