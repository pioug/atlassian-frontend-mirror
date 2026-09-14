import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/00-basic-example.vr.ap';
import AppearanceVariations from '../../../examples/01-appearance-variations.vr.ap';
import Actions from '../../../examples/06-actions.vr.ap';
import ExplicitFontStyles from '../../../examples/07-explicit-font-styles.vr.ap';
import Dismissible from '../../../examples/08-dismissible.vr.ap';
import Testing from '../../../examples/99-testing.vr.ap';

snapshot(Basic, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
	],
});

snapshot(AppearanceVariations, {});

snapshot(Actions);

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

snapshot(ExplicitFontStyles, {
	description: 'Explicit font styles - default state',
});

snapshot(Dismissible);
