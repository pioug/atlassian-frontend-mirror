import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/00-basic.vr.ap';
import Indeterminate from '../../../examples/01-indeterminate.vr.ap';
import SuccessProgressBar from '../../../examples/02-success-progress-bar.vr.ap';
import TransparentProgressBar from '../../../examples/03-transparent-progress-bar.vr.ap';

snapshot(Basic, {
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
snapshot(Indeterminate, {
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
snapshot(SuccessProgressBar, {
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
snapshot(TransparentProgressBar, {
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
