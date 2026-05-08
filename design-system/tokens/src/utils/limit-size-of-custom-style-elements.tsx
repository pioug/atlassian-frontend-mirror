import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../constants';

export function limitSizeOfCustomStyleElements(sizeThreshold: number): void {
	const styleTags = Array.from(
		document.head.querySelectorAll(`style[${CUSTOM_THEME_ATTRIBUTE}][${THEME_DATA_ATTRIBUTE}]`),
	);

	if (styleTags.length < sizeThreshold) {
		return;
	}

	styleTags.slice(0, styleTags.length - (sizeThreshold - 1)).forEach((element) => element.remove());
}
