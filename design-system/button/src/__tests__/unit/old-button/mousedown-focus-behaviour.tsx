import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

const types: React.ElementType[] = ['button', 'a', 'span'];

types.forEach((tag: React.ElementType) => {
	// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
	describe(`focus behaviour [type: <${tag}>]`, () => {
		// Note: this behaviour sucks but it is so engrained in usages of button that it will be really hard to unwind
		it('should call event.prevent default on mouse down to prevent the button getting focus', () => {
			// create a random button that will have focus
			const el: HTMLElement = document.createElement('button');
			el.innerText = 'Save';
			document.body.appendChild(el);
			el.focus();
			expect(el).toHaveFocus();

			render(
				<Button testId="button" component={tag}>
					Hello
				</Button>,
			);
			const button: HTMLElement = screen.getByTestId('button');

			// event prevented
			const allowed: boolean = fireEvent.mouseDown(button);
			expect(allowed).toBe(false);

			// focus not lost from original element
			expect(el).toHaveFocus();
		});
	});
});
