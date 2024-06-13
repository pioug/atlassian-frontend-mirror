import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should render a anchor if there is a href', () => {
	render(
		<Button testId="button" href="http://google.com">
			Hello
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');
	expect(button.tagName.toLowerCase()).toBe('a');
});

it('should render a custom tag if provided', () => {
	render(
		<Button testId="button" href="http://google.com" component="span">
			Hello
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');
	expect(button.tagName.toLowerCase()).toBe('span');
});
