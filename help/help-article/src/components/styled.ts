/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const ArticleContentInner = styled.div`
  padding-bottom: ${token('space.200', '16px')};
  position: relative;
`;

export const ArticleContentTitle = styled.div`
  padding-bottom: ${token('space.200', '16px')};
`;

export const ArticleContentTitleLink = styled.a`
  &:hover {
    text-decoration: none;
  }
`;
