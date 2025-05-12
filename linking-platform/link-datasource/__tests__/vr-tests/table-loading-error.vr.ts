import { snapshot } from '@af/visual-regression';

import {
	ConfluenceLoadingErrorVR,
	GenericLoadingErrorVR,
	GenericLoadingErrorWithoutRefreshVR,
	JiraLoadingErrorVR,
} from '../../examples/vr/table-loading-error-vr';

snapshot(GenericLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(GenericLoadingErrorWithoutRefreshVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(JiraLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

snapshot(ConfluenceLoadingErrorVR, {
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});
