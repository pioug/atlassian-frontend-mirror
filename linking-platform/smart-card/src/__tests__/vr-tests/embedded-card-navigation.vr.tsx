import { snapshot } from '@af/visual-regression';

import EmbeddedCardNavigation from '../../../examples/vr-flexible-card/vr-embedded-card-navigation.vr.ap';

snapshot(EmbeddedCardNavigation, {
	description: 'Embedded card navigation enabled',
	featureFlags: { confluence_ep_shim_macro_links_v2: true },
	waitForReactLazy: true,
});

snapshot(EmbeddedCardNavigation, {
	description: 'Embedded card navigation disabled',
	featureFlags: { confluence_ep_shim_macro_links_v2: false },
	waitForReactLazy: true,
});
