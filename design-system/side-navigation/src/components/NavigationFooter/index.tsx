/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const navigationFooterStyles = xcss({
  position: 'relative',
});

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
      padding="space.100"
      paddingBlockEnd="space.200"
      xcss={navigationFooterStyles}
    >
      {children}
    </Box>
  );
};

export default NavigationFooter;
