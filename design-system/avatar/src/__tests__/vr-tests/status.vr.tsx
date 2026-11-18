import { snapshot } from '@af/visual-regression';

import BasicStatus from '../../../examples/05-basic-status.vr.ap';

snapshot(BasicStatus, {
	variants: [
		{ name: 'light mode', environment: { colorScheme: 'light' } },
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests -- Dark mode exposes the HDS-5322 border mismatch; the two surface tokens have identical light-theme values.
		{ name: 'dark mode', environment: { colorScheme: 'dark' } },
	],
});
