/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const ArticleContentInner = styled.div({
  paddingBottom: token('space.200', '16px'),
  position: 'relative',
});

export const ArticleContentTitle = styled.div({
  paddingBottom: token('space.200', '16px'),
});

export const ArticleContentTitleLink = styled.a({
  '&:hover': {
    textDecoration: 'none',
  },
});
