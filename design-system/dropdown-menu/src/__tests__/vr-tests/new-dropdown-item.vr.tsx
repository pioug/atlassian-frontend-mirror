import { snapshot } from '@af/visual-regression';

import NewDropdownMenuItemExample from '../../../examples/40-new-dropdown-item.vr.ap';

snapshot(NewDropdownMenuItemExample, {
	featureFlags: { 'platform-dst-new-menu': true },
});
