import { snapshot } from '@af/visual-regression';

import { IconElementAllVariations } from '../../../examples/vr-icon-element-variations/vr-icon-element-all-variations.vr.ap';

snapshot(IconElementAllVariations, {
	description: 'icon element all variations with experiments',
	featureFlags: {
		platform_sl_3p_preauth_better_hovercard_killswitch: [true, false],
		platform_sl_3p_preauth_better_hovercard: [true, false],
	},
	waitForReactLazy: true,
});
