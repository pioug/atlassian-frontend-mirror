import { snapshot } from '@af/visual-regression';

import ControlledExpandedState from '../../../examples/controlled-expanded-state.vr.ap';
import FocusRing from '../../../examples/focus-ring.vr.ap';
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

snapshot(FocusRing, {
	description: 'shows the focus ring for an interactive element in a single-line cell',
	featureFlags: {
		platform_dst_table_tree_single_line_focus_ring: [false, true],
	},
	states: [{ state: 'focused', selector: { byTestId: 'single-line-cell-link' } }],
});
