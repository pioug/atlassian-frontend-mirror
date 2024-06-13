import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should render content in order: iconBefore, children, iconAfter', () => {
	render(
		<Button testId="button" iconBefore="before" iconAfter="after">
			children
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');

	expect(button.innerText).toBe('beforechildrenafter');
});
