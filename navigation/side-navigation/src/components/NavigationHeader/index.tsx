/** @jsx jsx */
import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

export interface NavigationHeaderProps {
  children: JSX.Element | JSX.Element[];
}

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
