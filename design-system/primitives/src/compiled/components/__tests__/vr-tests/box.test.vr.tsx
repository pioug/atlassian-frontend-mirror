import { snapshot } from '@af/visual-regression';

import Box from '../../../../../examples/02-box-compiled.vr.ap';
import BoxPadding from '../../../../../examples/03-box-padding-compiled.vr.ap';
import BoxColor from '../../../../../examples/05-box-color-compiled.vr.ap';
import BoxCustomStyles from '../../../../../examples/07-box-custom-styles-compiled.vr.ap';
import BoxSurfaceDetection from '../../../../../examples/08-box-surface-detection-compiled.vr.ap';

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
