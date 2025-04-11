import { snapshot } from '@af/visual-regression';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';
import IssueLikeTableCustomColumns from '../../examples/vr/issue-like-table-custom-columns';
import IssueLikeTableReadonly from '../../examples/vr/issue-like-table-readonly';

snapshot(VRIssueLikeTable, {
	description: 'Issue Like Table',
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(IssueLikeTableReadonly, {
	description: 'Readonly Issue Like Table',
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(IssueLikeTableCustomColumns, {
	description: 'Issue Like Table With Custom Columns',
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});
