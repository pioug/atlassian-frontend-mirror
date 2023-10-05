import { snapshot } from '@af/visual-regression';

import EmbedCardError from '../../../examples/vr-embed-card/vr-embed-card-error';
import EmbedCardForbidden from '../../../examples/vr-embed-card/vr-embed-card-forbidden';
import EmbedCardForbiddenObjectRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-object-request-access';
import EmbedCardForbiddenSiteDeniedAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-denied-access';
import EmbedCardForbiddenSiteDirectAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-direct-access';
import EmbedCardForbiddenSitePendingAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-pending-access';
import EmbedCardForbiddenSiteRequestAccess from '../../../examples/vr-embed-card/vr-embed-card-forbidden-site-request-access';
import EmbedCardNotFound from '../../../examples/vr-embed-card/vr-embed-card-not-found';
import EmbedCardNotFoundSiteAccessExists from '../../../examples/vr-embed-card/vr-embed-card-not-found-site-access-exists';
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
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardForbidden, {
  description: 'refreshed embed card forbidden view',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardForbiddenObjectRequestAccess, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardForbiddenSiteDeniedAccess, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardForbiddenSiteDirectAccess, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardForbiddenSitePendingAccess, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardForbiddenSiteRequestAccess, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardNotFound, {
  description: 'refreshed embed card link not found',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardNotFoundSiteAccessExists, {
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.cross-join': true,
  },
});
snapshot(EmbedCardResolved, {
  description: 'refreshed embed card resolved view',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardUnauthorised, {
  description: 'refreshed embed card unathorised view',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardUnauthorisedWithProviderImage, {
  description: 'refreshed embed card unathorised view with provider image',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
snapshot(EmbedCardUnauthorisedNoAuth, {
  description: 'refreshed embed card unathorised view with no auth',
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});
