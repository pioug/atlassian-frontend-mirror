import React from 'react';

import { render, screen } from '@testing-library/react';

import EmptyState from '../../empty-state';
import { type Width } from '../../types';

const sizes: Width[] = ['narrow', 'wide'];

const widths = {
	narrow: '19pc', // 304px
	wide: '29pc', // 464px
};

describe('<EmptyState size/width />', () => {
	it('should default to wide', () => {
		render(<EmptyState header="hello" testId="test" />);
		const element = screen.getByTestId('test');
		expect(element).toHaveStyle(`max-width: ${widths.wide}`);
	});

	sizes.forEach((size) => {
		describe(`with ${size} setting`, () => {
			it('should prefer width over size', () => {
				render(
					<EmptyState
						width={size}
						size={size === 'wide' ? 'narrow' : 'wide'}
						header="hello"
						testId="test"
					/>,
				);
				const element = screen.getByTestId('test');
				// expect(element).toHaveStyleDeclaration('max-width', widths[size]);
				expect(element).toHaveStyle(`max-width: ${widths[size]}`);
			});

			it('should support size', () => {
				render(<EmptyState size={size} header="hello" testId="test" />);
				const element = screen.getByTestId('test');
				//expect(element).toHaveStyleDeclaration('max-width', widths[size]);
				expect(element).toHaveStyle(`max-width: ${widths[size]}`);
			});

			it('should support width', () => {
				render(<EmptyState width={size} header="hello" testId="test" />);
				const element = screen.getByTestId('test');
				//expect(element).toHaveStyleDeclaration('max-width', widths[size]);
				expect(element).toHaveStyle(`max-width: ${widths[size]}`);
			});
		});
	});
});
