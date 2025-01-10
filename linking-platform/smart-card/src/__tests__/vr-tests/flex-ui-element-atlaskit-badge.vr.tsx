import { snapshot } from '@af/visual-regression';

import FlexUiAtlaskitBadgeView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-atlaskit-badge';

snapshot(FlexUiAtlaskitBadgeView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});
