import { Device, snapshot } from '@af/visual-regression';

import Variations from '../../../examples/01-variations.vr.ap';
import Widths from '../../../examples/01-widths.vr.ap';
import ElementsBeforeAndAfter from '../../../examples/05-elements-before-and-after.vr.ap';
import Customisation from '../../../examples/08-customisation.vr.ap';

snapshot(Variations, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'mobile webkit',
			device: Device.MOBILE_WEBKIT,
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(ElementsBeforeAndAfter, {
	states: [{ state: 'focused', selector: { byRole: 'button' } }],
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Widths, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(Customisation, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
