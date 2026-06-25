import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/00-single-select';
import CheckboxSelect from '../../../../examples/03-checkbox-select';
import Invalid from '../../../../examples/05-validation';
import Disabled from '../../../../examples/24-disabled';
import Appearance from '../../../../examples/26-appearance';
import ControlledGroup from '../../../../examples/32-controlled-group';

snapshot(Basic, {
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

snapshot(ControlledGroup, {
	drawsOutsideBounds: true, // only captures the select trigger without this
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

// Voice-control accessible dropdown indicator: visual appearance must be
// pixel-identical to the gate-off rendering, because the new <button> uses
// an `appearance: none` reset and inherits color/padding from the existing
// dropdown indicator. This snapshot guards against any unintended visual
// regression when the gate is flipped on.
snapshot(Basic, {
	description: 'voice-control-dropdown-ff-on',
	featureFlags: {
		platform_dst_select_dropdown_voice_control: true,
	},
	variants: [
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});
