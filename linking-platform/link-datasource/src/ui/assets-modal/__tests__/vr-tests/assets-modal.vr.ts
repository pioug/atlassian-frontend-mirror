import { snapshot } from '@af/visual-regression';

import WithAssetsModalVR from '../../../../../examples/with-assets-modal-vr';

/**
 * These tests are making external network request which needs be fixed
 * Ticket: https://product-fabric.atlassian.net/browse/EDM-7660
 * Slack: https://atlassian.slack.com/archives/CR5KWBDT4/p1692161302662599
 */
// Screenshot mismatch on CI https://product-fabric.atlassian.net/browse/EDM-7675
snapshot.skip(WithAssetsModalVR, {
  description: 'display assets modal',
  drawsOutsideBounds: true,
});
