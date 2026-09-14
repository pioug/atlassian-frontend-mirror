import { snapshot } from '@af/visual-regression';

import ColorRoles from '../../../examples/0-color-roles.vr.ap';

snapshot(ColorRoles, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
	],
});
