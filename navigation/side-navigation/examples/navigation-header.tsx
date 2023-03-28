import React, { MouseEvent } from 'react';

import Box from '@atlaskit/ds-explorations/box';

import { CustomItemComponentProps, Header, NavigationHeader } from '../src';

import RocketIcon from './common/sample-logo';

const InteractiveContainer = ({
  children,
  ...props
}: CustomItemComponentProps) => {
  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    <a href="#" {...props}>
      {children}
    </a>
  );
};

const Example = () => {
  return (
    <Box
      display="block"
      onClick={(e: MouseEvent) => e.preventDefault()}
      as="div"
    >
      <NavigationHeader>
        <Header description="Next-gen software">Concise Systems</Header>
      </NavigationHeader>

      <NavigationHeader>
        <Header
          component={InteractiveContainer}
          description="Next-gen software"
        >
          Concise Systems
        </Header>
      </NavigationHeader>

      <NavigationHeader>
        <Header iconBefore={<RocketIcon />} description="Next-gen software">
          Concise Systems
        </Header>
      </NavigationHeader>

      <NavigationHeader>
        <Header
          component={InteractiveContainer}
          iconBefore={<RocketIcon />}
          description="Next-gen software"
        >
          Concise Systems
        </Header>
      </NavigationHeader>
    </Box>
  );
};

export default Example;
