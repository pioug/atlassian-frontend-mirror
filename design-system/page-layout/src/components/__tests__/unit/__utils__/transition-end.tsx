import { act, fireEvent } from '@testing-library/react';

export const completeAnimations = (): void => {
	act(() => {
		jest.runAllTimers();
	});
};
export const triggerTransitionEnd = (component: any): void => {
	// JSDom doesn't trigger transitionend event
	// https://github.com/jsdom/jsdom/issues/1781
	const transitionEndEvent = new Event('transitionend', {
		bubbles: true,
		cancelable: false,
	});
	(transitionEndEvent as any).propertyName = 'width';

	fireEvent(component, transitionEndEvent);
	completeAnimations();
};
