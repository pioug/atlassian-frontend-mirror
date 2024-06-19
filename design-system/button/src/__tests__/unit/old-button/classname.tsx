// disable this rule here due to the custom class name, we only need to test the count and one emotion class
/* eslint-disable jest-dom/prefer-to-have-class */
/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should support passing in additional classnames', () => {
	render(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<Button testId="button" className="hello">
			children
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');

	// one emotion class name and one custom class name
	expect(button.classList.length).toBe(2);
	expect(button.classList.contains('hello')).toBe(true);
});

it('should merge css props into one classname', () => {
	render(
		<Button testId="button" css={{ color: 'red' }}>
			children
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');

	// one emotion class name
	expect(button.classList.length).toBe(1);
});

it('should merge css props into one classname, and independent class names separately', () => {
	render(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<Button testId="button" css={{ color: 'red' }} className="hello">
			children
		</Button>,
	);
	const button: HTMLElement = screen.getByTestId('button');

	// one emotion class name + one custom class name
	expect(button.classList.length).toBe(2);
	expect(button.classList.contains('hello')).toBe(true);
});
