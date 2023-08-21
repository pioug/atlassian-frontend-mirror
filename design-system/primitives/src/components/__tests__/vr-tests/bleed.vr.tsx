// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/63-bleed';

snapshot(Example, {
  variants: [
    {
      name: 'bleed default',
      environment: {},
    },
  ],
});
