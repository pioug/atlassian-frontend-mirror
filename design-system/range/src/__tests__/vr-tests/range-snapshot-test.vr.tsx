import { snapshot } from '@af/visual-regression';

import BasicExampleUncontrolled from '../../../examples/00-basic-example-uncontrolled';
import DisabledDisplay from '../../../examples/02-disabled-display';
import DifferentValues from '../../../examples/09-different-values';

snapshot(BasicExampleUncontrolled, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(DisabledDisplay, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(DifferentValues);
