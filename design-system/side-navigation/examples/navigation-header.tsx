import React, { MouseEvent } from 'react';

import { Box } from '@atlaskit/primitives';

import { CustomItemComponentProps, Header, NavigationHeader } from '../src';

import NextGenProjectIcon from './common/next-gen-project-icon';
import RocketIcon from './common/sample-logo';

const InteractiveContainer = ({
  children,
  ...props
}: CustomItemComponentProps) => {
  return (
    <>
      {/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, jsx-a11y/anchor-is-valid */}
      <a href="#" {...props}>
        {children}
      </a>
    </>
  );
};

const Example = () => {
  return (
    <Box onClick={(e: MouseEvent) => e.preventDefault()}>
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
          iconBefore={<NextGenProjectIcon />}
          description="Next-gen software"
        >
          Concise Systems
        </Header>
      </NavigationHeader>
    </Box>
  );
};

export default Example;
