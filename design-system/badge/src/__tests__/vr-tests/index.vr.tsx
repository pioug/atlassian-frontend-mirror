import { snapshot } from '@af/visual-regression';

import BadgeBasic from '../../../examples/0-basic.vr.ap';
import BadgeCustomization from '../../../examples/4-customization.vr.ap';
import BadgeContainers from '../../../examples/5-containers.vr.ap';
import BadgeVisualUplifts from '../../../examples/6-badge-visual-uplifts-behind-ff.vr.ap';

snapshot(BadgeCustomization);
snapshot(BadgeContainers);

snapshot(BadgeBasic, {
	variants: [
		{
			name: 'light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'none',
			environment: {
				colorScheme: 'no-preference',
			},
		},
	],
});

snapshot(BadgeVisualUplifts, {
	description: 'badge-visual-uplifts',
	variants: [
		{
			name: 'visual-uplift',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
