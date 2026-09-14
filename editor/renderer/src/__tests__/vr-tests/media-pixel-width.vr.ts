import { Device, snapshot } from '@af/visual-regression';
import {
	MediaWrappedLeftFullWidth,
	MediaWrappedLeftFullPage,
} from './media-pixel-width.fixtures.vr.ap';

snapshot(MediaWrappedLeftFullWidth, {
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

snapshot(MediaWrappedLeftFullPage);
