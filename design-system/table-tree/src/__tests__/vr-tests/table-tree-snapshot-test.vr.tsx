import { snapshot } from '@af/visual-regression';

import ControlledExpandedState from '../../../examples/controlled-expanded-state.vr.ap';
import VrLoadingNested from '../../../examples/vr-loading-nested.vr.ap';
import VrLoading from '../../../examples/vr-loading.vr.ap';
import VrOverflow from '../../../examples/vr-overflow-behavior.vr.ap';

snapshot(ControlledExpandedState, {
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
snapshot(VrLoading, {
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
snapshot(VrLoadingNested, {
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
snapshot(VrOverflow, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
