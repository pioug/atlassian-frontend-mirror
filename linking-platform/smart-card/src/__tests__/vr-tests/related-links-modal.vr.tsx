import { snapshot } from '@af/visual-regression';

import RelatedLinksModal from '../../../examples/vr-related-links-modal/vr-related-links-modal';

snapshot(RelatedLinksModal, {
  variants: [
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
