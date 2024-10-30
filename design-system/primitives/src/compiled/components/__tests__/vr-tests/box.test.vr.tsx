// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Box from '../../../../../examples/02-box-compiled';
import BoxPadding from '../../../../../examples/03-box-padding-compiled';
import BoxColor from '../../../../../examples/05-box-color-compiled';
import BoxCustomStyles from '../../../../../examples/07-box-custom-styles-compiled';
import BoxSurfaceDetection from '../../../../../examples/08-box-surface-detection-compiled';

snapshot(Box, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(BoxPadding, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(BoxColor, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(BoxCustomStyles, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(BoxSurfaceDetection, {
	variants: [],
});
