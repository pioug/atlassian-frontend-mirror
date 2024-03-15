import { snapshot } from '@af/visual-regression';

import {
  DefaultExample,
  ErrorExample,
  LoadingPlugins,
  LoadingResultsWithTabs,
  NoResults,
  ShowingResultsWhileLoadingResults,
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
snapshot(LoadingPlugins, options);
snapshot(NoResults, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-picker.remove-dst-empty-state': [
      true,
      false,
    ],
  },
});
snapshot(ErrorExample, {
  ...options,
  featureFlags: {
    'platform.linking-platform.link-picker.remove-dst-empty-state': [
      true,
      false,
    ],
  },
});
snapshot(LoadingResultsWithTabs, options);
snapshot(ShowingResultsWhileLoadingResults, options);
