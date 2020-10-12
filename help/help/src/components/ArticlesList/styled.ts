/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const ArticlesListContainer = styled.div`
  position: relative;
`;

export const ToggleShowMoreArticlesContainer = styled.div`
  padding: ${gridSize()}px 0;
  span {
    margin: 0;
  }
`;
