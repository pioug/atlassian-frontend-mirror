/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N20A } from '@atlaskit/theme/colors';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { verticalPadding } from './constants';

const gridSize = getGridSize();

const avatarSectionStyles = css({
  gridArea: 'avatar-area',
});

const inlineCommentStyles = css({
  gridTemplate: `
  "avatar-area comment-area"
  "nested-comments-area nested-comments-area"
  / auto 1fr`,
});

const containerStyles = css({
  display: 'grid',
  paddingTop: `${verticalPadding}px`,
  position: 'relative',
  gap: `${gridSize}px`,
  gridTemplate: `"avatar-area comment-area" \
    ". nested-comments-area"
    / auto 1fr`,
  /* We need both selectors as there is not a common wrapper component around
  comments. We also provide isFirst as an escape hatch. */
  '&:first-child, &:first-of-type': {
    paddingTop: 0,
  },
});

const contentSectionStyles = css({
  minWidth: 0,
  marginTop: `${gridSize / 4}px`,
  gridArea: 'comment-area',
  wordWrap: 'break-word',
});

const highlightStyles = css({
  width: '100%',
  height: '100%',
  padding: `${gridSize}px ${gridSize}px ${gridSize / 2}px`,
  background: token('color.background.neutral', N20A),
  gridArea: '1 / 1 / 2 / 3',
  pointerEvents: 'none',
  transform: `translate(-${gridSize}px, -${gridSize}px)`,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '[dir="rtl"] &': {
    transform: `translate(${gridSize}px, -${gridSize}px)`,
  },
});

const nestedCommentsContainerStyles = css({
  marginTop: `${verticalPadding}px`,
  gridArea: 'nested-comments-area',
});

interface LayoutProps {
  /**
   * The element to display as the Comment avatar - generally an Atlaskit Avatar
   */
  avatar?: ReactNode;
  /**
   * Nested comments to render
   */
  children?: ReactNode;
  /**
   * The main content of the Comment
   */
  content?: ReactNode;
  /**
   * Whether this comment should appear highlighted
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  highlighted?: boolean;
  /**
   * Optional ID for the comment
   */
  id?: string;
  /**
   * Optional boolean to render any child comments at the same level as this comment
   */
  shouldRenderNestedCommentsInline?: boolean;
  /**
   * Hook for automated testing.
   */
  testId?: string;
}

/**
 * __Layout__
 *
 * The base layout for the comment component.
 *
 */
const Layout: FC<LayoutProps> = ({
  content,
  children,
  highlighted,
  id,
  shouldRenderNestedCommentsInline,
  testId,
  avatar,
}) => (
  <div
    css={[
      containerStyles,
      shouldRenderNestedCommentsInline && inlineCommentStyles,
    ]}
    data-testid={testId}
    id={id}
  >
    {avatar && <div css={avatarSectionStyles}>{avatar}</div>}
    <div css={contentSectionStyles}>{content}</div>
    {children && <div css={nestedCommentsContainerStyles}>{children}</div>}
    {highlighted && <div css={highlightStyles} />}
  </div>
);

export default Layout;
