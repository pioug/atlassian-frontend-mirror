import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { StopPropagation } from '../index';

describe('StopPropagation', () => {
	it('does not propagrate click event', () => {
		const onClick = jest.fn();
		render(
			<div onClick={onClick}>
				<StopPropagation>
					<button>Click</button>
				</StopPropagation>
			</div>,
		);

		const button = screen.getByRole('button', { name: 'Click' });
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('should capture and report a11y violations', async () => {
		const onClick = jest.fn();
		const { container } = render(
			<div onClick={onClick}>
				<StopPropagation>
					<button>Click</button>
				</StopPropagation>
			</div>,
		);

		await expect(container).toBeAccessible();
	});
});
