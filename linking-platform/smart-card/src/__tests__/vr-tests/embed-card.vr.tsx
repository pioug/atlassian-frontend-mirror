import { snapshot } from '@af/visual-regression';

import EmbedCardError from '../../../examples/vr-embed-card/vr-embed-card-error';
import EmbedCardForbidden from '../../../examples/vr-embed-card/vr-embed-card-forbidden';
import EmbedCardNotFound from '../../../examples/vr-embed-card/vr-embed-card-not-found';
import EmbedCardResolved from '../../../examples/vr-embed-card/vr-embed-card-resolved';
import EmbedCardUnauthorised from '../../../examples/vr-embed-card/vr-embed-card-unauthorised';
import EmbedCardUnauthorisedWithProviderImage from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-with-provider-image';
import EmbedCardUnauthorisedNoAuth from '../../../examples/vr-embed-card/vr-embed-card-unauthorised-no-auth';

/**
 * These tests are making external network request which needs be fixed
 * Ticket: https://product-fabric.atlassian.net/browse/EDM-7660
 * Slack: https://atlassian.slack.com/archives/CR5KWBDT4/p1692161302662599
 */
snapshot(EmbedCardError);
snapshot.skip(EmbedCardForbidden);
snapshot.skip(EmbedCardNotFound);
snapshot(EmbedCardResolved);
snapshot.skip(EmbedCardUnauthorised);
snapshot(EmbedCardUnauthorisedWithProviderImage);
snapshot.skip(EmbedCardUnauthorisedNoAuth);

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
snapshot.skip(EmbedCardForbidden, {
  description: 'refreshed embed card forbidden view',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
snapshot.skip(EmbedCardNotFound, {
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
snapshot.skip(EmbedCardUnauthorised, {
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
snapshot.skip(EmbedCardUnauthorisedNoAuth, {
  description: 'refreshed embed card unathorised view with no auth',
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});
