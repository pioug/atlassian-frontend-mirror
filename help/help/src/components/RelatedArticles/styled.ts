/** @jsx jsx */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { gridSize, fontSize } from '@atlaskit/theme/constants';

const baseHeading = (size: number, lineHeight: number) => `
  font-size: ${size / fontSize()}em;
  font-style: inherit;
  line-height: ${lineHeight / size};
`;

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const RelatedArticlesTitle = styled.div`
  ${baseHeading(16, 20)}
  color: ${colors.heading};
  font-weight: 600;
  letter-spacing: -0.006em;
  padding: ${gridSize() * 2}px 0;
`;

/**
 * Loading styled-components
 */
export const LoadignRelatedArticleSection = styled.div`
  margin-top: ${gridSize()}px;
`;

export const LoadignRelatedArticleList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const LoadignRelatedArticleListItem = styled.li`
  display: block;
  width: 100%;
  padding: ${gridSize()}px;
  margin-bottom: ${gridSize() * 2}px;
  box-sizing: border-box;
`;
