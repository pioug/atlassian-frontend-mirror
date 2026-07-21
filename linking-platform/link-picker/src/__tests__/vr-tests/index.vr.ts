import { snapshot } from '@af/visual-regression';

import {
	VrErrorInPopupWithWhitespaceNowrapAncestor,
	VrNoResultsInPopupWithWhitespaceNowrapAncestor,
} from '../../../examples/vr';

/** Remove on cleanup of platform_link_picker_fix_error_state_text_overflow */
snapshot(VrNoResultsInPopupWithWhitespaceNowrapAncestor, {
	drawsOutsideBounds: true,
	featureFlags: {
		platform_link_picker_fix_error_state_text_overflow: [true, false],
	},
});

/** Remove on cleanup of platform_link_picker_fix_error_state_text_overflow */
snapshot(VrErrorInPopupWithWhitespaceNowrapAncestor, {
	drawsOutsideBounds: true,
	featureFlags: {
		platform_link_picker_fix_error_state_text_overflow: [true, false],
	},
	ignoredErrors: [
		{
			pattern: /Simulated search error/,
			ignoredBecause: 'Intentionally rejecting the plugin promise to trigger the error state',
			jiraIssueId: 'NONE-123',
		},
	],
});
