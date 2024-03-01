/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const ArticleFrame = styled.iframe({
  display: 'block',
  width: `calc(100% + ${token('space.150', '12px')})`,
  margin: token('space.negative.050', '-4px'),
  border: 'none',
});
