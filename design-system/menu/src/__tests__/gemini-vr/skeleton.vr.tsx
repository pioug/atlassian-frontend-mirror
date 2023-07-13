import { snapshot } from '@af/visual-regression';

import SkeletonItems, {
  SkeletonItemLoaded,
} from '../../../examples/06-skeleton-items';

snapshot(SkeletonItems, {
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
