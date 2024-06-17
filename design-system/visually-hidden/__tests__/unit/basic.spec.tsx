/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import VisuallyHidden from '../../src';

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
		expect(element).toHaveStyleDeclaration('width', '1px');
		expect(element).toHaveStyleDeclaration('height', '1px');
		expect(element).toHaveStyleDeclaration('position', 'absolute');
		expect(element).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
	});
});
