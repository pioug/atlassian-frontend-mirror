/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const ArticleContentInner = styled.div`
  padding-bottom: ${2 * gridSize()}px;
  position: relative;
`;

export const ArticleContentTitle = styled.div`
  padding-bottom: ${2 * gridSize()}px;
`;

export const ArticleContentTitleLink = styled.a`
  &:hover {
    text-decoration: none;
  }
`;
