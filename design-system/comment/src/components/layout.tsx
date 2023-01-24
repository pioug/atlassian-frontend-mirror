/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
} from '@atlaskit/ds-explorations';
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
  gap: token('spacing.scale.100', '8px'),
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
  backgroundColor: token('color.background.neutral', N20A),
  gridArea: '1 / 1 / 2 / 3',
  inset: `calc(-1 * ${token('spacing.scale.100', '8px')})`,
  pointerEvents: 'none',
});

const stackOverrideStyles = {
  gridArea: 'nested-comments-area',
  paddingTop: token('spacing.scale.300', '24px'),
} as React.CSSProperties;

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
  // eslint-disable-next-line @repo/internal/react/use-primitives
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
      <Stack gap="space.400" UNSAFE_style={stackOverrideStyles}>
        {children}
      </Stack>
    )}
    {highlighted && (
      <Box
        display="block"
        padding="space.100"
        position="absolute"
        css={highlightOverlayStyles}
      />
    )}
  </div>
);

Layout.displayName = 'CommentLayout';

export default Layout;
