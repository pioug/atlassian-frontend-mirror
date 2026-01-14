import React from 'react';

import { renderWithDi, render as rtlRender, screen } from '@atlassian/testing-library';

import Badge from '../../index';

const render = (component: React.ReactNode) => {
	return rtlRender(<React.StrictMode>{component}</React.StrictMode>);
};

describe('badge component', () => {
	const testId = 'test';

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithDi(<Badge />);

		await expect(container).toBeAccessible();
	});

	it('should render 0 by default', () => {
		render(<Badge />);
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it.each([-1, -100, -Infinity])('should clamp negative numeric children (value=%p)', (value) => {
		render(<Badge>{value}</Badge>);
		expect(screen.getByText(value)).toBeInTheDocument();
	});

	it.each(['-100', '0', '100', 'abc', '+100,000.333'])(
		'should render string children exactly (value=%p)',
		(value) => {
			render(<Badge>{value}</Badge>);
			expect(screen.getByText(value)).toBeInTheDocument();
		},
	);
	``;

	it('should render original value when max is set to false', () => {
		render(<Badge max={false}>{100}</Badge>);
		expect(screen.getByText('100')).toBeInTheDocument();
	});

	it.each([
		[10, 100, '10'],
		[1000, 100, '100+'],
	])(
		'should respect positive values of max (value=%p, max=%p, expected=%p)',
		(value, max, expected) => {
			render(<Badge max={max}>{value}</Badge>);
			expect(screen.getByText(expected)).toBeInTheDocument();
		},
	);

	it.each([
		[0, -1, '-1+'],
		[10, -10, '-10+'],
		[-20, -10, '-20'],
		[100, 0, '0+'],
		[Infinity, -100, '-100+'],
	])(
		'should not ignore non-positive values for max (value=%p, max=%p, expected=%p)',
		(value, max, expected) => {
			render(<Badge max={max}>{value}</Badge>);
			expect(screen.getByText(expected)).toBeInTheDocument();
		},
	);

	it.each([0, -100, -Infinity])(
		'should not clamp negative numeric values (value=%p, expected="%p")',
		(value) => {
			render(<Badge>{value}</Badge>);
			expect(screen.getByText(value)).toBeInTheDocument();
		},
	);

	it.each([
		[Infinity, -100, '-100+'],
		[1000, Infinity, '1000'],
		[Infinity, 100, '100+'],
		[Infinity, Infinity, '∞'],
	])('should handle Infinity (value=%p, max=%p, expected=%p)', (value, max, expected) => {
		render(<Badge max={max}>{value}</Badge>);
		expect(screen.getByText(expected)).toBeInTheDocument();
	});

	it('should render with a given test id', () => {
		render(<Badge testId={testId} />);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
	});
});
