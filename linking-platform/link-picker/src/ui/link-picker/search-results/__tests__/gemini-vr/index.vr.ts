import { snapshot } from '@af/visual-regression';

import {
  DefaultExample,
  ErrorExample,
  LoadingPlugins,
  LoadingResultsWithTabs,
  NoResults,
  ShowingResultsWhileLoadingResults,
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

snapshot(DefaultExample, options);
snapshot(LoadingPlugins, options);
snapshot(NoResults, options);
snapshot(ErrorExample, options);
snapshot(LoadingResultsWithTabs, options);
snapshot(ShowingResultsWhileLoadingResults, options);
