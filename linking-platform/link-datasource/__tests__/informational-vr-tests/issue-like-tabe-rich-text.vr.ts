import { Device, snapshotInformational } from '@af/visual-regression';

import { VRIssueLikeTableRichText } from '../../examples/vr/issue-like-table-richtext.vr.ap';

// Will be re-enabled as part of UTEST-2316.
snapshotInformational.skip(VRIssueLikeTableRichText, {
	variants: [
		{
			name: 'desktop chrome 1920x1080',
			device: Device.DESKTOP_CHROME_1920_1080,
		},
	],
	description: 'rich text column',
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
		{
			pattern: /(the server responded with a status of 404)/,
			ignoredBecause: 'Most likely realted to image resources contained in rich text html',
			jiraIssueId: 'NONE-124',
		},
	],
	featureFlags: {
		'lp_enable_datasource-table-view_height_override': [true],
	},
});
