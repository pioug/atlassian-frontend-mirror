import { snapshot } from '@af/visual-regression';

import AlignmentExample from '../../../examples/50-alignment';

snapshot(AlignmentExample, {
  featureFlags: {
    'platform.design-system-team.button-tokenised-typography-styles': [
      false,
      true,
    ],
  },
});
