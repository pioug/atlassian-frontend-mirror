import React from 'react';

import { CustomThemeButton } from '../src';

import Example from './utils/example-runner';
import { interactionTasks } from './utils/interaction-tasks';

const customThemeButton = () => <Example Component={CustomThemeButton} />;

customThemeButton.story = {
  name: 'CustomThemeButton',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default customThemeButton;
