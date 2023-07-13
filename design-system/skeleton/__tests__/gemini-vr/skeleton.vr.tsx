import { snapshot } from '@af/visual-regression';

import All from '../../examples/all';

snapshot(All, {
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
