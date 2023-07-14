import { snapshot } from '@af/visual-regression';

import ExperimentalTreeItem from '../../examples/11-experimental-tree-item';

snapshot(ExperimentalTreeItem, {
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
