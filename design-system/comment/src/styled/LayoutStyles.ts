import styled from '@emotion/styled';

import { N20A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { verticalPadding } from './constants';

export const AvatarSectionDiv = styled.div`
  /* stylelint-enable */
  grid-area: avatar-area;
`;

const renderContainerGridTemplate = (props: {
  shouldRenderNestedCommentsInline?: boolean;
}) => (props.shouldRenderNestedCommentsInline ? 'nested-comments-area' : '.');

export const Container = styled.div`
  /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
  display: grid;
  gap: ${gridSize()}px;
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
  grid-area: comment-area;
  margin-top: ${gridSize() * 0.25}px;
  /* Required for word-wrap: break-word to work in a grid */
  min-width: 0;
  word-wrap: break-word;
`;

export const Highlight = styled.div`
  background: ${token('color.background.subtleNeutral.resting', N20A)};
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
  grid-area: nested-comments-area;
  margin-top: ${verticalPadding}px;
`;
