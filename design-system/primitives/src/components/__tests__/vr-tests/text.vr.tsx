// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/70-text';
import Inverse from '../../../../examples/71-text-inverse';
import Truncation from '../../../../examples/72-text-truncation';

snapshot(Basic, {
  variants: [
    {
      name: 'text default',
      environment: {},
    },
  ],
});
snapshot(Inverse, {
  variants: [
    {
      name: 'text inverse',
      environment: {},
    },
  ],
});
snapshot(Truncation, {
  variants: [
    {
      name: 'text truncation',
      environment: {},
    },
  ],
});
