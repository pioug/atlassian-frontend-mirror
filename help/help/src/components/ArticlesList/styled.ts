/** @jsx jsx */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

export const truncate = (width: string = '100%') =>
  css({
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: width,
  });

export const ArticlesListContainer = styled.div({
  position: 'relative',
});

export const ToggleShowMoreArticlesContainer = styled.div({
  padding: `${token('space.100', '8px')} 0`,
  span: {
    margin: 0,
  },
});
