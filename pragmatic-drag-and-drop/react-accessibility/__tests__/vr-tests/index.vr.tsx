import { snapshot } from '@af/visual-regression';

import DragHandleButtonExample from '../../examples/drag-handle-button';

snapshot(DragHandleButtonExample, {
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
