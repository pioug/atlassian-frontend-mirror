// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/62-grid-gap';

snapshot(Example, {
  variants: [
    {
      name: 'grid default',
      environment: {},
    },
  ],
});
