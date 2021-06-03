import React from 'react';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

export const Container = (props) => <div {...props} />;

export const HeaderContainer = (props) => {
  const { styles, ...rest } = props;
  return (
    <div
      css={{
        ...styles,
        paddingTop: gridSize * 2.5,
        paddingBottom: gridSize * 2.5,
      }}
      {...rest}
    />
  );
};
