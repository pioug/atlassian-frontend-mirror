// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import AnchorDefault from '../../../../examples/44-anchor-default';
import AnchorStyled from '../../../../examples/45-anchor-styled';

snapshot(AnchorDefault, {
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

snapshot(AnchorStyled, {
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
