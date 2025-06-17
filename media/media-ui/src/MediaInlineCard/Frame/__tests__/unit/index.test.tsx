import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Frame } from '../..';

describe('Frame', () => {
	it('should call onClick when the card is clicked', () => {
		const onClick = jest.fn();
		render(<Frame onClick={onClick} />);

		const frame = screen.getByRole('button');
		fireEvent.click(frame);

		expect(onClick).toHaveBeenCalled();
	});

	it('should call onClick when the space key is pressed', () => {
		const onClick = jest.fn();
		render(<Frame onClick={onClick} />);

		const frame = screen.getByRole('button');
		const spaceCharCode = 32;
		fireEvent.keyPress(frame, { key: ' ', code: spaceCharCode, charCode: spaceCharCode });

		expect(onClick).toHaveBeenCalled();
	});

	it('should call onClick when the enter key is pressed', () => {
		const onClick = jest.fn();
		render(<Frame onClick={onClick} />);

		const frame = screen.getByRole('button');
		const enterCharCode = 13;
		fireEvent.keyPress(frame, { key: 'Enter', code: enterCharCode, charCode: enterCharCode });

		expect(onClick).toHaveBeenCalled();
	});

	it('should be void of a11y violations', async () => {
		const { container } = render(<Frame />);
		await expect(container).toBeAccessible();
	});
});
