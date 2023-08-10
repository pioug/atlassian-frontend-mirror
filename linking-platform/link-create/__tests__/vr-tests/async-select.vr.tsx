import { snapshot } from '@af/visual-regression';

import {
  AsyncSelectorAllProps,
  DefaultAsyncSelect,
} from '../../examples/vr/vr-async-select';

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

snapshot(DefaultAsyncSelect, options);
snapshot(AsyncSelectorAllProps, options);
