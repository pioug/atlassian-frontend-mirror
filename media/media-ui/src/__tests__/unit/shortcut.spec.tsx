import React from 'react';
import { render } from '@atlassian/testing-library';
import { Shortcut } from '../..';

describe('Shortcut', () => {
	it('should de-register the key event listener on unmount', () => {
		const handler = jest.fn();

		const { unmount } = render(
			<div>
				<Shortcut code="ArrowLeft" handler={handler} eventType="keyup" />
			</div>,
		);

		document.dispatchEvent(
			new KeyboardEvent('keyup', { bubbles: true, cancelable: true, code: 'ArrowLeft' }),
		);
		expect(handler).toHaveBeenCalledTimes(1);

		unmount();

		document.dispatchEvent(
			new KeyboardEvent('keyup', { bubbles: true, cancelable: true, code: 'ArrowLeft' }),
		);
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('should execute handler', () => {
		const handler = jest.fn();

		render(
			<div>
				<Shortcut code="ArrowLeft" handler={handler} eventType="keyup" />
			</div>,
		);

		document.dispatchEvent(
			new KeyboardEvent('keyup', { bubbles: true, cancelable: true, code: 'ArrowLeft' }),
		);

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('should not introduce any accessibility violations', async () => {
		render(
			<div>
				<Shortcut code="ArrowLeft" handler={jest.fn()} eventType="keyup" />
			</div>,
		);
		await expect(document.body).toBeAccessible();
	});
});
