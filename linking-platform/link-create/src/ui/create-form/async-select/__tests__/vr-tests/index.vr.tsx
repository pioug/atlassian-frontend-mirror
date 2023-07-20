import { snapshot } from '@af/visual-regression';

import {
  AsyncSelectIsRequired,
  AsyncSelectorAllProps,
  AsyncSelectValidationHelpText,
  DefaultAsyncSelect,
  // eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
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

snapshot(DefaultAsyncSelect, options);
snapshot(AsyncSelectValidationHelpText, options);
snapshot(AsyncSelectIsRequired, options);
snapshot(AsyncSelectorAllProps, options);
