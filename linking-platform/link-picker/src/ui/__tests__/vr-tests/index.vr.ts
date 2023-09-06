import { snapshot } from '@af/visual-regression';

import {
  DefaultExample,
  DisableWidth300Example,
  DisableWidth500Example,
  DisableWidthExample,
  DisableWidthWithPluginsExample,
} from '../../examples';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
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
};

snapshot(DefaultExample, options);
snapshot(DisableWidthExample, options);
snapshot(DisableWidthWithPluginsExample, options);
snapshot(DisableWidth500Example, options);
snapshot(DisableWidth300Example, options);
