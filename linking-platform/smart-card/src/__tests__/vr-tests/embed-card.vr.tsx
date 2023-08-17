import { snapshot } from '@af/visual-regression';

import EmbedCardError from '../../../examples/vr-embed-card/vr-embed-card-error';
import EmbedCardForbidden from '../../../examples/vr-embed-card/vr-embed-card-forbidden';
import EmbedCardNotFound from '../../../examples/vr-embed-card/vr-embed-card-not-found';
import EmbedCardResolved from '../../../examples/vr-embed-card/vr-embed-card-resolved';
import EmbedCardUnauthorised from '../../../examples/vr-embed-card/vr-embed-card-unauthorised';
import EmbedCardUnauthorisedWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image';
import EmbedCardUnauthorisedNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth';

snapshot(EmbedCardError);
snapshot(EmbedCardForbidden);
snapshot(EmbedCardNotFound);
snapshot(EmbedCardResolved);
snapshot(EmbedCardUnauthorised);
snapshot(EmbedCardUnauthorisedWithProviderImage);
snapshot(EmbedCardUnauthorisedNoAuth);

// //Same list of tests for refreshed embed card design under the FF
// //TODO: Delete during the 'platform.linking-platform.smart-card.show-smart-links-refreshed-design' FF clean up

snapshot(EmbedCardError, {
  description: 'refreshed embed card error view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardForbidden, {
  description: 'refreshed embed card forbidden view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardNotFound, {
  description: 'refreshed embed card link not found',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardResolved, {
  description: 'refreshed embed card resolved view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardUnauthorised, {
  description: 'refreshed embed card unathorised view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardUnauthorisedWithProviderImage, {
  description: 'refreshed embed card unathorised view with provider image',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot(EmbedCardUnauthorisedNoAuth, {
  description: 'refreshed embed card unathorised view with no auth',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
