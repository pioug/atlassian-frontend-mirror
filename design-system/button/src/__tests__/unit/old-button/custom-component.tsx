import React from 'react';

import { render, screen } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should render a custom component if provided', () => {
	const Custom = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(function Custom(
		{ children, ...rest },
		ref,
	) {
		return (
			<div ref={ref} {...rest}>
				{children} World
			</div>
		);
	});

	render(
		<Button testId="button" component={Custom}>
			Hello
		</Button>,
	);
	const button = screen.getByTestId('button');

	expect(button.tagName.toLowerCase()).toBe('div');
	expect(button.innerText).toBe('Hello World');
});

it('should support having a custom component with extra strange props', () => {
	type LinkProps = React.AllHTMLAttributes<HTMLElement> & {
		to: string;
	};
	const Link = React.forwardRef(function Link(
		{ children, to, ...rest }: LinkProps,
		ref: React.Ref<HTMLElement>,
	) {
		return (
			<span ref={ref} {...rest} data-href={to}>
				{children} World
			</span>
		);
	});

	render(
		// @ts-ignore: incorrect typing at this stage
		<Button testId="button" to="http://google.com" component={Link}>
			Hello
		</Button>,
	);
	const button = screen.getByTestId('button');

	expect(button.tagName.toLowerCase()).toBe('span');
	expect(button).toHaveAttribute('data-href', 'http://google.com');
});
