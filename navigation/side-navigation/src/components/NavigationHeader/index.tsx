/** @jsx jsx */
import { jsx } from '@emotion/react';

import Box from '@atlaskit/ds-explorations/box';
import { token } from '@atlaskit/tokens';

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
    <Box
      display="block"
      data-navheader
      padding="scale.100"
      UNSAFE_style={{
        paddingTop: token('spacing.scale.300', '24px'),
      }}
    >
      {children}
    </Box>
  );
};

export default NavigationHeader;
