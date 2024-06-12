// eslint-disable-next-line import/no-extraneous-dependencies
import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/00-basic-example';
import AppearanceVariations from '../../../examples/01-appearance-variations';
import Testing from '../../../examples/99-testing';

snapshot(Basic, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
	],
});

snapshot(AppearanceVariations, {
	variants: [
		{
			name: 'no preference',
			environment: {
				colorScheme: 'no-preference',
			},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});

snapshot(Testing, {
	description: 'word wrapping behaviour',
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});
