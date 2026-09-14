/**
 * @jsxRuntime classic
 * @jsx jsx
 */

export const scrollToValue = (valueContainer: HTMLDivElement, control: HTMLElement): void => {
	const { top, height } = valueContainer.getBoundingClientRect();
	const { height: controlHeight } = control.getBoundingClientRect();

	if (top - height < 0) {
		valueContainer.scrollIntoView();
	}

	if (top + height > controlHeight) {
		valueContainer.scrollIntoView(false);
	}
};
