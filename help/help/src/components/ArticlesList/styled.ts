/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

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
  padding: ${token('space.100', '8px')} 0;
  span {
    margin: 0;
  }
`;
