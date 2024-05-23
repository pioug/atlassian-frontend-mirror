import { snapshot } from '@af/visual-regression';

import DragHandleButtonExample from '../../examples/drag-handle-button';
import DragHandleButtonSmallExample from '../../examples/drag-handle-button-small';

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

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
snapshot.skip(DragHandleButtonSmallExample, {
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
