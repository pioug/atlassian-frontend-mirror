// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import AnchorDefault from '../../../../examples/44-anchor-default';
import AnchorStyled from '../../../../examples/45-anchor-styled';
import AnchorNewWindow from '../../../../examples/47-anchor-new-window';

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

snapshot(AnchorNewWindow, {
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
