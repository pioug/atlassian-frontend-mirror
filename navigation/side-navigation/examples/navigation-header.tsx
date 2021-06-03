import React from 'react';

import { CustomItemComponentProps, Header, NavigationHeader } from '../src';

import RocketIcon from './common/sample-logo';

const InteractiveContainer = ({
  children,
  ...props
}: CustomItemComponentProps) => {
  return (
    <a href="#" {...props}>
      {children}
    </a>
  );
};

const Example = () => {
  return (
    <div onClick={(e) => e.preventDefault()}>
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
    </div>
  );
};

export default Example;
