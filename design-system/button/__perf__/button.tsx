import React from 'react';

import Button from '../src';

import Example from './utils/example-runner';
import { interactionTasks } from './utils/interaction-tasks';

const button = () => <Example Component={Button} />;

button.story = {
  name: 'Button',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default button;
