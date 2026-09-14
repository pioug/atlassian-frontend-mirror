import { Device, snapshot } from '@af/visual-regression';
import {
	MediaImageInlineWithWideLayout,
	MediaWithPixelWidthFullWidthNested,
	MediaWithPixelWidthNested,
} from '../__helpers/rendererComponents.vr.ap';

snapshot(MediaWithPixelWidthNested, {
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

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(MediaImageInlineWithWideLayout, {
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
