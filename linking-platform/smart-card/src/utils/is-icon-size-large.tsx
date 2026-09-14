import { SmartLinkSize } from '../constants';

export const isIconSizeLarge = (size?: SmartLinkSize): boolean | undefined =>
	size && [SmartLinkSize.Large, SmartLinkSize.XLarge].includes(size);
