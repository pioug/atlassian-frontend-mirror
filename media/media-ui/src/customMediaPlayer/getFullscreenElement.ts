import { findVendorSpecificProp } from './findVendorSpecificProp';

export const getFullscreenElement = (): HTMLElement | undefined => {
	return findVendorSpecificProp(document, ['fullScreenElement', 'fullscreenElement']);
};
