/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Stack from '@atlaskit/primitives/stack';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import AvatarSlot from './slots/avatar-slot';
import ContentSlot from './slots/content-slot';

const inlineCommentStyles = css({
  gridTemplateAreas: `
  "avatar-area comment-area"
  "nested-comments-area nested-comments-area"`,
});

const containerStyles = css({
  display: 'grid',
  position: 'relative',
  gap: token('space.100', '8px'),
  gridTemplateAreas: `"avatar-area comment-area" \
    ". nested-comments-area"`,
  gridTemplateColumns: 'auto 1fr',
});

const gridTemplateNoChildrenStyles = css({
  gridTemplateAreas: `"avatar-area comment-area"`,
});

// if the background is appied on Box and tokens are not switched on it breaks.
// This can be safely removed (and applied on Box) when tokens are on by default
const highlightOverlayStyles = css({
  padding: token('space.100', '8px'),
  position: 'absolute',
  inset: `calc(-1 * ${token('space.100', '8px')})`,
  backgroundColor: token('color.background.neutral', N20A),
  gridArea: '1 / 1 / 2 / 3',
  pointerEvents: 'none',
});

const stackOverrideStyles = css({
  paddingTop: token('space.300', '24px'),
  gridArea: 'nested-comments-area',
});

export interface CommentLayoutProps {
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
 * __CommentLayout__
 *
 * The base layout for the comment component.
 *
 */
const Layout: FC<CommentLayoutProps> = ({
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
      !children && gridTemplateNoChildrenStyles,
    ]}
    data-testid={testId}
    id={id}
  >
    {avatar && <AvatarSlot>{avatar}</AvatarSlot>}
    {content && <ContentSlot>{content}</ContentSlot>}
    {children && (
      <span css={stackOverrideStyles}>
        <Stack space="space.400">{children}</Stack>
      </span>
    )}
    {highlighted && (
      <div
        css={highlightOverlayStyles}
        data-testid={testId && `${testId}-highlighted`}
      />
    )}
  </div>
);

Layout.displayName = 'CommentLayout';

export default Layout;
