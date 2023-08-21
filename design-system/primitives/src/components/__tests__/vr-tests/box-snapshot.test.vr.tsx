// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Box from '../../../../examples/02-box';
import BoxPadding from '../../../../examples/03-box-padding';
import BoxColor from '../../../../examples/05-box-color';
import BoxCustomStyles from '../../../../examples/07-box-custom-styles';

snapshot(Box, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(BoxPadding, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(BoxColor, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
snapshot(BoxCustomStyles, {
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
  ],
});
