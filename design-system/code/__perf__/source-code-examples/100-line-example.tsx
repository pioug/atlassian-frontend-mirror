// eslint-disable-file
export const hundredLineExample = `/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React, { forwardRef, useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { UNSAFE_Box as Box, UNSAFE_BoxProps as BoxProps, UNSAFE_Inline as Inline, UNSAFE_Text as Text, UNSAFE_TextProps as TextProps, } from '@atlaskit/ds-explorations';
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
  appearance?: Appearance;
  children?: React.ReactNode;
  icon?: React.ReactElement;
  testId?: string;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ appearance = 'warning', children, icon, testId }, ref) => {
    const appearanceType =
      appearance in backgroundColors ? appearance : 'warning';

    const accessibilityProps = useMemo(() => {
      const baseProps = {
        role: 'alert',
      };

      if (appearance === 'announcement') {
        return {
          ...baseProps,
          'aria-label': 'announcement',
          tabIndex: 0,
          role: 'region',
        };
      }

      return baseProps;
    }, [appearance]);

    return (
      <Box display="block" backgroundColor={backgroundColors[appearanceType]} paddingInline="space.150" overflow="hidden" testId={testId} ref={ref} {...accessibilityProps} UNSAFE_style={{ paddingBlock: '14px', maxHeight: '52px', }} css={nestedLinkStyles} >
        <Inline gap="space.050" alignItems="center" justifyContent="start">
          {icon ? (
            <Box
              as="span"
              display="inline"
              width="size.300"
              height="size.300" // This matches Icon's "medium" size, without this the (line-)height is greater than that of the Icon
              UNSAFE_style={{
                fill: tokenBackgroundColors[appearanceType],
                color: tokenTextColors[appearanceType],
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          ) : null}
          <Text fontWeight="medium" lineHeight="lineHeight.300" color={textColors[appearanceType]} shouldTruncate> {children} </Text>
        </Inline>
      </Box>
    );
  },
);

export default Banner;`;
