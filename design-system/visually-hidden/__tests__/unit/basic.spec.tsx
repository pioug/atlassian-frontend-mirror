import * as React from 'react';

import { render, screen } from '@testing-library/react';

import VisuallyHidden from '../../src';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Visually Hidden', () => {
	it('renders', () => {
		render(
			<VisuallyHidden>
				<div data-testid="test" />
			</VisuallyHidden>,
		);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});

	it('is queryable by an id', () => {
		render(<VisuallyHidden id="test">Hidden</VisuallyHidden>);

		expect(screen.getByText('Hidden').id).toEqual('test');
	});

	it('has key visually hidden styles', () => {
		render(<VisuallyHidden>Hidden</VisuallyHidden>);

		const element = screen.getByText('Hidden');
		expect(element).toHaveCompiledCss('width', '1px');
		expect(element).toHaveCompiledCss('height', '1px');
		expect(element).toHaveCompiledCss('position', 'absolute');
		expect(element).toHaveCompiledCss('clip', 'rect(1px,1px,1px,1px)');
	});
});
