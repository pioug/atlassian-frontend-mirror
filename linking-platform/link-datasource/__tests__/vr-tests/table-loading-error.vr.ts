import { snapshot } from '@af/visual-regression';

import {
	ConfluenceLoadingErrorVR,
	GenericLoadingErrorVR,
	GenericLoadingErrorWithoutRefreshVR,
	JiraLoadingErrorVR,
} from '../../examples/vr/table-loading-error-vr';

snapshot(GenericLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': true,
	},
});

snapshot(GenericLoadingErrorWithoutRefreshVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': true,
	},
});

snapshot(JiraLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': true,
	},
});

snapshot(ConfluenceLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': true,
	},
});
