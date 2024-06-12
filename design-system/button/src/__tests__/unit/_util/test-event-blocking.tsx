import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

import { type CommonButtonProps } from '../../../new-button/variants/types';
import { type Variant } from '../../../utils/variants';

const events: Array<keyof React.DOMAttributes<HTMLElement>> = [
	'onMouseDown',
	'onMouseUp',
	'onKeyDown',
	'onKeyUp',
	'onTouchStart',
	'onTouchEnd',
	'onPointerDown',
	'onPointerUp',
];

const fireButtonEvents = async (button: HTMLElement, user: UserEvent) => {
	await user.hover(button);
	await user.click(button);
	// Touch events not supported for userEvent
	fireEvent(
		button,
		new Event('touchstart', {
			bubbles: true,
			cancelable: true,
		}),
	);
	fireEvent(
		button,
		new Event('touchend', {
			bubbles: true,
			cancelable: true,
		}),
	);
	await user.keyboard('{enter}');
	await user.unhover(button);
};

/**
 * Tests button events do not fire given a set of provided props
 */
export default function testEventBlocking(
	Component: Variant['Component'],
	props?: Omit<CommonButtonProps<any>, 'children'>,
) {
	events.forEach(async (eventName) => {
		it(`should not fire '${eventName}' events`, async () => {
			const user = userEvent.setup();

			const parentHandler = { [eventName]: jest.fn() };
			const buttonHandler = { [eventName]: jest.fn() };

			// Step 1: Initially no prop changes to validate event binding works
			const { getByTestId, rerender } = render(
				<div {...parentHandler}>
					<Component testId="button" {...buttonHandler}>
						Hello
					</Component>
				</div>,
			);
			const button = getByTestId('button');

			await fireButtonEvents(button, user);

			expect(buttonHandler[eventName]).toHaveBeenCalled();
			expect(parentHandler[eventName]).toHaveBeenCalled();

			// Step 2: With props
			buttonHandler[eventName].mockClear();
			parentHandler[eventName].mockClear();
			rerender(
				<div {...parentHandler}>
					<Component testId="button" {...props} {...buttonHandler}>
						Hello
					</Component>
				</div>,
			);

			await fireButtonEvents(button, user);

			expect(parentHandler[eventName]).not.toHaveBeenCalled();
			expect(buttonHandler[eventName]).not.toHaveBeenCalled();
		});
	});
}
