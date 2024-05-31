import { Device, snapshot } from '@af/visual-regression';
import {
	DatasourceWithRichTextFullPage,
	DatasourceWithRichTextFullWidth,
} from '../__helpers/rendererComponents';

/**
 * These tests are making external network request which needs be fixed
 * Ticket: https://product-fabric.atlassian.net/browse/ED-19691
 * Slack: https://atlassian.slack.com/archives/C05DWCW6ZAN/p1692671566069189
 */
snapshot.skip(DatasourceWithRichTextFullPage, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	drawsOutsideBounds: true,
});

snapshot.skip(DatasourceWithRichTextFullWidth, {
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	drawsOutsideBounds: true,
});
