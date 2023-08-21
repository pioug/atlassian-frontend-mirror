// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import SpacingVr from '../../../examples/4-spacing-vr';
import ShapeVr from '../../../examples/8-shape-vr';

snapshot(SpacingVr, {
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
snapshot(ShapeVr);
