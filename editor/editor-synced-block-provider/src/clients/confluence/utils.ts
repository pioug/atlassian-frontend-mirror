import type { PAGE_TYPE } from './ari';

export const isBlogPageType = (pageType: PAGE_TYPE): boolean => {
	return pageType === 'blogpost';
};
