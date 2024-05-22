/** @jsx jsx */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const baseHeading = (size: number, lineHeight: number) => `
  font-size: ${size / fontSize()}em;
  font-style: inherit;
  line-height: ${lineHeight / size};
`;

export const truncate = (width: string = '100%') =>
  css({
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: width,
  });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const RelatedArticlesTitle = styled.div(baseHeading(16, 20), {
  color: token('color.text', colors.N800),
  fontWeight: 600,
  letterSpacing: '-0.006em',
  padding: `${token('space.200', '16px')} 0`,
});

/**
 * Loading styled-components
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadignRelatedArticleSection = styled.div({
  marginTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadignRelatedArticleList = styled.ul({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const LoadignRelatedArticleListItem = styled.li({
  display: 'block',
  width: '100%',
  padding: token('space.100', '8px'),
  marginBottom: token('space.200', '16px'),
  boxSizing: 'border-box',
});
