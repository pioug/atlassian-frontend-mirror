import { snapshot } from '@af/visual-regression';

import { EmptyFullPageEditor } from './full-page-appearance.fixtures';

snapshot(EmptyFullPageEditor, {
	featureFlags: {
		platform_editor_usesharedpluginstateselector: [true, false],
	},
});
