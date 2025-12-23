import { TableCssClassName as ClassName } from '../types';

export const updateShadowListForStickyStyles = (heightStyle: string, shadows: HTMLCollection): void => {
	Array.from(shadows).forEach((shadow) => {
		if (shadow.classList.contains(ClassName.TABLE_STICKY_SHADOW)) {
			if (shadow instanceof HTMLElement && shadow.style.height !== heightStyle) {
				shadow.style.height = heightStyle;
			}
		}
	});
};
