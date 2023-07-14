import { snapshot } from '@af/visual-regression';

import ExampleComment from '../../../../examples/01-example-comment';
import NestedComments from '../../../../examples/03-nested-comments';
import WithInlineChildren from '../../../../examples/10-with-inline-children';

snapshot(ExampleComment, {
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
snapshot(WithInlineChildren);
snapshot(NestedComments, {
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
