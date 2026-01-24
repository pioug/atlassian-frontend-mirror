import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { Frame } from '../..';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

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
