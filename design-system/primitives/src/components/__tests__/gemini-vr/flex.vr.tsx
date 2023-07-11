import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/61-flex';

snapshot(Example, {
  variants: [
    {
      name: 'flex default',
      environment: {},
    },
  ],
});
