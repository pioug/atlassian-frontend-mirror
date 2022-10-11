/** @jsx jsx */
import { jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

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
    <div
      data-navheader
      css={{
        paddingTop: gridSize() * 3,
        paddingBottom: gridSize(),
        paddingLeft: gridSize(),
        paddingRight: gridSize(),
      }}
    >
      {children}
    </div>
  );
};

export default NavigationHeader;
