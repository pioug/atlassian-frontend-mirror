import { snapshot } from '@af/visual-regression';

import IssueLikeTableCustomColumns from '../../examples/vr/issue-like-table-custom-columns.vr.ap';
import IssueLikeTableReadonly from '../../examples/vr/issue-like-table-readonly.vr.ap';
import { VRIssueLikeTable } from '../../examples/vr/issue-like-table.vr.ap';

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
});
