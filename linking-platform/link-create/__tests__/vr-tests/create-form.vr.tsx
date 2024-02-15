import { snapshot } from '@af/visual-regression';

import {
  CreateFormHideFooter,
  CreateFormIsLoading,
  CreateFormWithAsyncSelect,
  CreateFormWithTextField,
  DefaultCreateForm,
} from '../../examples/vr/vr-create-form';

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

snapshot(DefaultCreateForm, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-create.enable-expected-field-errors': [
      true,
      false,
    ],
  },
});
snapshot(CreateFormIsLoading, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-create.enable-expected-field-errors': true,
  },
});
snapshot(CreateFormHideFooter, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-create.enable-expected-field-errors': true,
  },
});
snapshot(CreateFormWithTextField, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-create.enable-expected-field-errors': true,
  },
});
snapshot(CreateFormWithAsyncSelect, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-create.enable-expected-field-errors': true,
  },
});
