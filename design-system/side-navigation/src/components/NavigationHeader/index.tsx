/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const navigationFooterStyles = xcss({
  display: 'block',
  padding: 'space.100',
  paddingTop: 'space.300',
});

export interface NavigationHeaderProps {
  children: JSX.Element | JSX.Element[];
}

/**
 * __Navigation header__
 *
 * Allows for customisation of the header.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationHeader = (props: NavigationHeaderProps) => {
  const { children } = props;
  return (
    <Box xcss={navigationFooterStyles} data-navheader>
      {children}
    </Box>
  );
};

export default NavigationHeader;
