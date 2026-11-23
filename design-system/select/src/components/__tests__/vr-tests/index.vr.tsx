import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/00-single-select.vr.ap';
import CheckboxSelect from '../../../../examples/03-checkbox-select.vr.ap';
import Invalid from '../../../../examples/05-validation.vr.ap';
import Disabled from '../../../../examples/24-disabled.vr.ap';
import Appearance from '../../../../examples/26-appearance.vr.ap';
import ControlledGroup from '../../../../examples/32-controlled-group.vr.ap';
import ConstrainedWidth from '../../../../examples/35-dropdown-indicator-constrained-width.vr.ap';
import InlineMenuCustomMenu from '../../../../examples/37-inline-menu-custom-menu.vr.ap';

snapshot(Basic, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'mobile webkit',
			device: Device.MOBILE_WEBKIT,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

snapshot(ControlledGroup, {
	drawsOutsideBounds: true, // only captures the select trigger without this
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'mobile webkit',
			device: Device.MOBILE_WEBKIT,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

snapshot(Disabled, {
	drawsOutsideBounds: true, // only captures the select trigger without this
});

snapshot(Appearance, {
	drawsOutsideBounds: true, // only captures the select trigger without this
});

snapshot(Invalid, {
	drawsOutsideBounds: true, // only captures the select trigger without this
});

snapshot(CheckboxSelect, {
	drawsOutsideBounds: true, // only captures the select trigger without this
});

snapshot(ConstrainedWidth, {
	description: 'constrained-width-consumer-button-styles',
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

// Inline mode keeps a custom `Menu` on both paths, so the header shows above the options.
snapshot(InlineMenuCustomMenu, {
	description: 'inline-menu-custom-menu',
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
	variants: [
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});
