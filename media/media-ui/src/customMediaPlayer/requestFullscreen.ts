import { findVendorSpecificProp } from './findVendorSpecificProp';

export const requestFullscreen = (element: HTMLElement): void => {
	const requestFullscreenProp = findVendorSpecificProp(element, [
		// The order here is important! Other way will make webkitRequestFullScreen to be picked up in chrome for example.
		'requestFullscreen',
		'requestFullScreen',
	]);

	if ((element as any)[requestFullscreenProp]) {
		(element as any)[requestFullscreenProp]();
	}
};
