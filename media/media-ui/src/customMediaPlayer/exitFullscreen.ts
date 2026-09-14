import { findVendorSpecificProp } from './findVendorSpecificProp';

export const exitFullscreen = (): void => {
	const exitFullScreenProp = findVendorSpecificProp(document, [
		// The order here is important! Other way will make webkitExitFullScreen to be picked up in chrome for example.
		'exitFullscreen',
		'exitFullScreen',
	]);

	if ((document as any)[exitFullScreenProp]) {
		(document as any)[exitFullScreenProp]();
	}
};
