import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should not focus on the element if autoFocus is not set', () => {
	render(<Button testId="button">Hello</Button>);
	const button: HTMLElement = screen.getByTestId('button');
	expect(button).not.toHaveFocus();
});

it('should focus on the element if autoFocus is set', () => {
	render(
		<Button testId="button" autoFocus>
			Hello
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');
	expect(button).toHaveFocus();
});

it('should only set auto focus based on initial render', () => {
	const { rerender } = render(<Button testId="button">Hello</Button>);
	const button: HTMLElement = screen.getByTestId('button');
	expect(button).not.toHaveFocus();

	// setting autoFocus to true after an initial render
	rerender(
		<Button testId="button" autoFocus>
			Hello
		</Button>,
	);
	expect(button).not.toHaveFocus();
});
