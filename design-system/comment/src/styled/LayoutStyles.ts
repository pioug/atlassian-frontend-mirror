import styled from 'styled-components';

import { N20A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { verticalPadding } from './constants';

const ThemeColor = {
  Highlight: {
    background: N20A,
  },
};

export const AvatarSectionDiv = styled.div`
  /* -ms- properties are necessary until MS supports the latest version of the grid spec */
  /* stylelint-disable value-no-vendor-prefix */
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  /* stylelint-enable */
  grid-area: avatar-area;
  /* Unfortunately it's still easier to use a margin here until MS supports grid-gap */
  margin-right: ${gridSize()}px;

  [dir='rtl'] & {
    margin-left: ${gridSize()}px;
    margin-right: 0;
  }
`;

const renderContainerGridTemplate = (props: {
  shouldRenderNestedCommentsInline?: boolean;
}) => (props.shouldRenderNestedCommentsInline ? 'nested-comments-area' : '.');

export const Container = styled.div`
  /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: auto 1fr;
  /* stylelint-enable */
  grid-template:
    'avatar-area comment-area'
    '${renderContainerGridTemplate} nested-comments-area'
    / auto 1fr;
  padding-top: ${verticalPadding}px;
  position: relative;

  /* We need both selectors as there is not a common wrapper component around
  comments. We also provide isFirst as an escape hatch. */
  &:first-child,
  &:first-of-type {
    padding-top: 0;
  }
`;

export const ContentSectionDiv = styled.div`
  -ms-grid-row: 1;
  -ms-grid-column: 2;
  grid-area: comment-area;
  margin-top: ${gridSize() * 0.25}px;
  /* Required for word-wrap: break-word to work in a grid */
  min-width: 0;
  word-wrap: break-word;
`;

export const Highlight = styled.div`
  background: ${ThemeColor.Highlight.background};
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  grid-area: 1 / 1 / 2 / 3;
  height: 100%;
  padding: ${gridSize()}px ${gridSize()}px ${gridSize() / 2}px;
  transform: translate(-${gridSize()}px, -${gridSize()}px);
  width: 100%;

  [dir='rtl'] & {
    transform: translate(${gridSize()}px, -${gridSize()}px);
  }
  pointer-events: none;
`;

export const NestedCommentsDiv = styled.div`
  -ms-grid-row: 2;
  -ms-grid-column: 2;
  grid-area: nested-comments-area;
  margin-top: ${verticalPadding}px;
`;
