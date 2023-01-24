/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';
import { token } from '@atlaskit/tokens';

export interface NavigationFooterProps {
  children: ReactNode;
}

/**
 * __Navigation footer__
 *
 * Allows for customisation of the footer.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationFooter = ({ children }: NavigationFooterProps) => {
  return (
    <Box
      display="block"
      position="relative"
      padding="space.100"
      UNSAFE_style={{
        paddingBottom: token('spacing.scale.200', '14px'),
      }}
    >
      {children as BoxProps['children']}
    </Box>
  );
};

export default NavigationFooter;
