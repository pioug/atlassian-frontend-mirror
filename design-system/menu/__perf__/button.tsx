import React from 'react';

import ButtonItem from '../src/menu-item/button-item';

import Example from './utils/example-runner';
import { interactionTasks } from './utils/interaction-tasks';

const buttonItem = () => (
  <Example Component={ButtonItem} displayName="Button item" />
);

buttonItem.story = {
  name: 'Button Item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default buttonItem;
