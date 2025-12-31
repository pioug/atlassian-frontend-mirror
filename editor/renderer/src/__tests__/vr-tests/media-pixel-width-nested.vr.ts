import { Device, snapshot } from '@af/visual-regression';
import {
	MediaImageInlineWithWideLayout,
	MediaWithPixelWidthFullWidthNested,
	MediaWithPixelWidthNested,
} from '../__helpers/rendererComponents';

snapshot(MediaWithPixelWidthNested, {
	featureFlags: {
		platform_editor_dec_a11y_fixes: true,
	},
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(MediaImageInlineWithWideLayout, {
	featureFlags: {
		platform_editor_dec_a11y_fixes: true,
	},
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(MediaWithPixelWidthFullWidthNested);
