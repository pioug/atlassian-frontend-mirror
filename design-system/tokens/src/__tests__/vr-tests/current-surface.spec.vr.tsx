// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import CurrentSurfaceVr from '../../../examples/10-current-surface-vr';

snapshot(CurrentSurfaceVr, {
  variants: [
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
