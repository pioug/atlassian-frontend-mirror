import { snapshot } from '@af/visual-regression';

import BadgeBasic from '../../../examples/0-basic';
import BadgeCustomization from '../../../examples/4-customization';

snapshot(BadgeCustomization);

snapshot(BadgeBasic, {
  variants: [
    {
      name: 'light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark',
      environment: {
        colorScheme: 'dark',
      },
    },
    {
      name: 'none',
      environment: {
        colorScheme: 'no-preference',
      },
    },
  ],
});
