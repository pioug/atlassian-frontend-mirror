import { snapshot } from '@af/visual-regression';

import AllFlagsExample from '../../../examples/00-all-flags';
import AllFlagsDefaultIconsExample from '../../../examples/01-all-flags-default-icons';
import AllFlagsLegacyIcons from '../../../examples/02-all-flags-legacy-icons';
import FlagsDifferentIcons from '../../../examples/18-different-icons';
import ExplicitFontStyles from '../../../examples/19-explicit-font-styles';

snapshot(AllFlagsExample);
snapshot(AllFlagsDefaultIconsExample);
snapshot(AllFlagsLegacyIcons);
snapshot(FlagsDifferentIcons);

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - default state',
});
snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - action button hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Understood',
				},
			},
		},
	],
});

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - action button focused',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'button',
				options: {
					name: 'Understood',
				},
			},
		},
	],
});
