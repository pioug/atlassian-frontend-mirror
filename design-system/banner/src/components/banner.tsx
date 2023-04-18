/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React, { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import {
  UNSAFE_Box as Box,
  UNSAFE_BoxProps as BoxProps,
  UNSAFE_Text as Text,
  UNSAFE_TextProps as TextProps,
} from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';
import { N0, N500, N700, R400, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// Applies styles to nested links within banner messages.
const nestedLinkStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'a, a:visited, a:hover, a:focus, a:active': {
    color: 'currentColor',
    textDecoration: 'underline',
  },
});

const backgroundColors: Record<Appearance, BoxProps['backgroundColor']> = {
  warning: 'warning.bold',
  error: 'danger.bold',
  announcement: 'neutral.bold',
};

const tokenBackgroundColors: Record<Appearance, string> = {
  warning: token('color.background.warning.bold', Y300),
  error: token('color.background.danger.bold', R400),
  announcement: token('color.background.neutral.bold', N500),
};

const textColors: Record<Appearance, TextProps['color']> = {
  warning: 'warning.inverse',
  error: 'inverse',
  announcement: 'inverse',
};

const tokenTextColors: Record<Appearance, string> = {
  warning: token('color.text.warning.inverse', N700),
  error: token('color.text.inverse', N0),
  announcement: token('color.text.inverse', N0),
};

type Appearance = 'warning' | 'error' | 'announcement';

interface BannerProps {
  /**
   * Visual style to be used for the banner
   */
  appearance?: Appearance;
  /**
   * Content to be shown next to the icon. Typically text content but can contain links.
   */
  children?: React.ReactNode;
  /**
   * Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)
   */
  icon?: React.ReactElement;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
}

/**
 * __Banner__
 *
 * A banner displays a prominent message at the top of the screen.
 *
 * - [Examples](https://atlassian.design/components/banner/examples)
 * - [Code](https://atlassian.design/components/banner/code)
 * - [Usage](https://atlassian.design/components/banner/usage)
 */
const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ appearance = 'warning', children, icon, testId }, ref) => {
    const appearanceType =
      appearance in backgroundColors ? appearance : 'warning';

    return (
      <Box
        display="block"
        backgroundColor={backgroundColors[appearanceType]}
        overflow="hidden"
        padding="space.150"
        testId={testId}
        ref={ref}
        role="alert"
        UNSAFE_style={{
          maxHeight: '48px',
        }}
        css={nestedLinkStyles}
      >
        <Inline space="space.050" alignBlock="center" alignInline="start">
          {icon ? (
            <Box
              as="span"
              display="inline"
              width="size.200"
              height="size.200" // This matches Icon's "medium" size, without this the (line-)height is greater than that of the Icon
              UNSAFE_style={{
                fill: tokenBackgroundColors[appearanceType],
                color: tokenTextColors[appearanceType],
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          ) : null}
          <Text
            fontWeight="medium"
            lineHeight="lineHeight.300"
            color={textColors[appearanceType]}
            shouldTruncate
          >
            {children}
          </Text>
        </Inline>
      </Box>
    );
  },
);

export default Banner;
