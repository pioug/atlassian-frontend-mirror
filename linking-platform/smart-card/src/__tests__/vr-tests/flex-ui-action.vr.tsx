import { snapshot } from '@af/visual-regression';

import FlexibleCardAction from '../../../examples/vr-flexible-card/vr-flexible-ui-action';

snapshot(FlexibleCardAction);
snapshot(FlexibleCardAction, {
  description: 'flexible card action with server action',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.follow-button': true,
    },
  },
});
