/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { Box, Grid, Stack, xcss } from '@atlaskit/primitives';
import { N20A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import AvatarSlot from './slots/avatar-slot';
import ContentSlot from './slots/content-slot';

const inlineCommentStyles = xcss({
  gridTemplateAreas: `
  "avatar-area comment-area"
  "nested-comments-area nested-comments-area"`,
});

const containerStyles = xcss({
  position: 'relative',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateAreas: `"avatar-area comment-area" \
    ". nested-comments-area"`,
});

// if the background is appied on Box and tokens are not switched on it breaks.
// This can be safely removed (and applied on Box) when tokens are on by default
const highlightOverlayStyles = xcss({
  padding: 'space.100',
  position: 'absolute',
  // @ts-expect-error needs negative tokens
  inset: `${token('space.negative.100', '-8px')}`,
  // @ts-expect-error needs background-color to be on new theme
  backgroundColor: token('color.background.neutral', N20A),
  gridArea: '1 / 1 / 2 / 3',
  pointerEvents: 'none',
});

const stackOverrideStyles = xcss({
  paddingTop: 'space.300',
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
  <Grid
    gap="space.100"
    templateAreas={!children ? ['avatar-area comment-area'] : undefined}
    xcss={[
      containerStyles,
      shouldRenderNestedCommentsInline && inlineCommentStyles,
    ]}
    testId={testId}
    id={id}
  >
    {avatar && <AvatarSlot>{avatar}</AvatarSlot>}
    {content && <ContentSlot>{content}</ContentSlot>}
    {children && (
      <Stack xcss={stackOverrideStyles} space="space.400">
        {children}
      </Stack>
    )}
    {highlighted && (
      <Box
        xcss={highlightOverlayStyles}
        testId={testId && `${testId}-highlighted`}
      />
    )}
  </Grid>
);

Layout.displayName = 'CommentLayout';

export default Layout;
