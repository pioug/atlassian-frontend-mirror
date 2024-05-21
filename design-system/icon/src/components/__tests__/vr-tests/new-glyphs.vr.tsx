import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-new-icon-button';

snapshot(Example, {
  featureFlags: {
    ['platform.design-system-team.enable-new-icons']: [true, false],
  },
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
