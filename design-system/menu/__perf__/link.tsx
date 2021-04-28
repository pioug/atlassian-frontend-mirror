import React from 'react';

import LinkItem from '../src/menu-item/link-item';

import Example from './utils/example-runner';
import { interactionTasks } from './utils/interaction-tasks';

const linkItem = () => <Example Component={LinkItem} displayName="Link item" />;

linkItem.story = {
  name: 'Link Item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default linkItem;
