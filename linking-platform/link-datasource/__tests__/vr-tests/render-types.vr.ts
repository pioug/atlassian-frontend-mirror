import { snapshot } from '@af/visual-regression';

import RenderAllTypes from '../../examples/render-all-types';

/**
 * These tests are making external network request which needs be fixed
 * Ticket: https://product-fabric.atlassian.net/browse/EDM-7660
 * Slack: https://atlassian.slack.com/archives/CR5KWBDT4/p1692161302662599
 */
snapshot.skip(RenderAllTypes, { description: 'Render all types' });
