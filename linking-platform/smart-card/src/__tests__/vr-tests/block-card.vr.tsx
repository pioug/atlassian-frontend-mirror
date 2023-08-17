import { snapshot } from '@af/visual-regression';

import BlockCardError from '../../../examples/vr-block-card/vr-block-card-error';
import BlockCardForbidden from '../../../examples/vr-block-card/vr-block-card-forbidden';
import BlockCardNotFound from '../../../examples/vr-block-card/vr-block-card-not-found';
import BlockCardUnauthorised from '../../../examples/vr-block-card/vr-block-card-unauthorised';
import BlockCardUnauthorisedNoAuth from '../../../examples/vr-block-card/vr-block-card-unauthorised-no-auth';

snapshot(BlockCardError);
snapshot(BlockCardForbidden);
snapshot(BlockCardNotFound);
snapshot(BlockCardUnauthorised);
snapshot(BlockCardUnauthorisedNoAuth);

// //Same list of tests for refreshed block card design under the FF
// //TODO: Delete during the 'platform.linking-platform.smart-card.show-smart-links-refreshed-design' FF clean up

snapshot(BlockCardError, {
  description: 'refreshed block card error view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(BlockCardForbidden, {
  description: 'refreshed block card forbidden view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(BlockCardNotFound, {
  description: 'refreshed block card link not found',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(BlockCardUnauthorised, {
  description: 'refreshed block card unauthorised view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(BlockCardUnauthorisedNoAuth, {
  description: 'refreshed block card unauthorised view with no auth',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
