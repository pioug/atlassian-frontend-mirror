import { snapshotInformational } from '@af/visual-regression';

import BasicAvatarGroup from '../../../../examples/02-basic-avatar-group';

snapshotInformational(BasicAvatarGroup, {
	prepare: async (_page, component) => {
		await component.getByTestId('stack--overflow-menu--trigger').click();
	},
	description: 'More indicator should open overflow dropdown with top-layer',
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});
