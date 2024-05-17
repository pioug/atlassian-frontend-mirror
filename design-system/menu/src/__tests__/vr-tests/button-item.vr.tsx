import { snapshot } from '@af/visual-regression';

import ButtonItem from '../../../examples/button-item';

snapshot(ButtonItem, {
  featureFlags: {
    'platform.design-system-team.menu-tokenised-typography-styles': [
      false,
      true,
    ],
  },
  variants: [
    {
      name: 'Default',
      environment: {},
    },
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});
