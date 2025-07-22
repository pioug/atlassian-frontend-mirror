import { snapshot } from '@af/visual-regression';

import {
	ConfluenceLoadingErrorVR,
	GenericLoadingErrorVR,
	GenericLoadingErrorWithoutRefreshVR,
	JiraLoadingErrorVR,
} from '../../examples/vr/table-loading-error-vr';

snapshot(GenericLoadingErrorVR, {
	featureFlags: {},
});

snapshot(GenericLoadingErrorWithoutRefreshVR, {
	featureFlags: {},
});

snapshot(JiraLoadingErrorVR, {
	featureFlags: {},
});

snapshot(ConfluenceLoadingErrorVR, {
	featureFlags: {},
});
