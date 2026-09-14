import { snapshot } from '@af/visual-regression';

import {
	ElementBrowserModal,
	ElementBrowserModalWithDisabled,
} from './elementBrowserModalComponent.vr.ap';

// there is subtle difference in how unicode symbol ⏎ (inside search input in this component) shows up on pipeline and locally
// as a workaround, this symbol has been for this snapshot
snapshot(ElementBrowserModal);

snapshot(ElementBrowserModalWithDisabled);
