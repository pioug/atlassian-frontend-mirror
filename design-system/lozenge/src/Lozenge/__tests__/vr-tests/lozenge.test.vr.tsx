import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/0-basic';
import BaselineAlignment from '../../../../examples/2-baseline-alignment';
import CustomColor from '../../../../examples/3-custom-color';
import WithCustomTheme from '../../../../examples/4-with-custom-theme';
import WidthHandling from '../../../../examples/5-width-handling';

snapshot(Basic, {
  variants: [
    {
      name: 'default',
      environment: {},
    },
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});

snapshot(BaselineAlignment);
snapshot(CustomColor);
snapshot(WithCustomTheme);
snapshot(WidthHandling);
