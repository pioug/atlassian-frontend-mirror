// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import AtlaskitThemeProvider from '../../../../examples/atlaskit-theme-provider';
import Colors from '../../../../examples/colors';

snapshot(Colors);
snapshot(AtlaskitThemeProvider, {
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
