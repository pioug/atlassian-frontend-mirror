import { snapshot } from '@af/visual-regression';

import { IconElementAllVariations } from '../../../examples/vr-icon-element-variations/vr-icon-element-all-variations';

snapshot(IconElementAllVariations, {
	description: 'icon element all variations with experiments',
	featureFlags: {
		platform_sl_3p_unauth_paste_as_block_card: 'card_by_default_and_new_design',
		platform_sl_3p_preauth_better_hovercard_killswitch: [true, false],
		platform_sl_3p_preauth_better_hovercard: [true, false],
	},
	waitForReactLazy: true,
});
