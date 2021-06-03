/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import Icon from '@atlaskit/icon';
import { CustomItemComponentProps } from '@atlaskit/menu';
import { Header } from '@atlaskit/side-navigation';
const Container: React.FC<CustomItemComponentProps> = (props) => {
  return <div {...props} />;
};

const ExampleHeader = () => {
  return (
    <Header
      component={Container}
      description="Next-gen service desk"
      iconBefore={<Icon label="" size="medium" />}
    >
      NXTGen Industries
    </Header>
  );
};

export default ExampleHeader;
