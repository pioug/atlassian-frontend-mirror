import { snapshot } from '@af/visual-regression';

import {
  DefaultInlineCreate,
  DefaultInlineCreateWithEditButton,
} from '../../examples/vr/vr-inline-create';

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

snapshot(DefaultInlineCreate, options);
snapshot(DefaultInlineCreateWithEditButton, options);
