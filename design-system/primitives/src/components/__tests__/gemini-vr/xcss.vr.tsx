import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/30-classname-basic';

snapshot(Example, {
  variants: [
    {
      name: 'default',
      environment: {},
    },
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});
