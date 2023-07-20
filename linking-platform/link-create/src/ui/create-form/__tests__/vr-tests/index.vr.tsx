import { snapshot } from '@af/visual-regression';

import {
  CreateFormHideFooter,
  CreateFormIsLoading,
  CreateFormWithAsyncSelect,
  CreateFormWithTextField,
  DefaultCreateForm,
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

snapshot(DefaultCreateForm, options);
snapshot(CreateFormIsLoading, options);
snapshot(CreateFormHideFooter, options);
snapshot(CreateFormWithTextField, options);
snapshot(CreateFormWithAsyncSelect, options);
