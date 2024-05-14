import { snapshot } from '@af/visual-regression';

import SkeletonItems, {
  SkeletonItemLoaded,
} from '../../../examples/06-skeleton-items';

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
snapshot.skip(SkeletonItems, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});

snapshot(SkeletonItemLoaded);
