import { snapshotInformational } from '@af/visual-regression';

import BasicAvatarGroup from '../../../../examples/02-basic-avatar-group';
import OverridesMoreIndicatorExample from '../../../../examples/30-overrides-more-indicator';

snapshotInformational(BasicAvatarGroup, {
	prepare: async (_page, component) => {
		await component.getByTestId('stack--overflow-menu--trigger').click();
	},
	description: 'More indicator should open overflow dropdown',
});

snapshotInformational(OverridesMoreIndicatorExample, {
	prepare: async (_page, component) => {
		await component.getByTestId('stack--overflow-menu--trigger-0').click();
	},
	description: 'More indicator with override should open overflow dropdown',
});
