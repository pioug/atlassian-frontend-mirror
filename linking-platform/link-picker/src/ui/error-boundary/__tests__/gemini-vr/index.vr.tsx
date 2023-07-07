import { snapshot } from '@af/visual-regression';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { ErrorBoundary } from '../../examples';

snapshot(ErrorBoundary, {
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
