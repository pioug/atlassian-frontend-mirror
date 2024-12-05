import { snapshot } from '@af/visual-regression';

import {
	ElementBrowserModal,
	ElementBrowserModalWithDisabled,
} from './elementBrowserModalComponent';

// there is subtle difference in how unicode symbol ⏎ (inside search input in this component) shows up on pipeline and locally
// as a workaround, this symbol has been for this snapshot
snapshot(ElementBrowserModal);

snapshot(ElementBrowserModalWithDisabled, {
	featureFlags: {
		platform_editor_is_disabled_state_element_browser: true,
	},
});
