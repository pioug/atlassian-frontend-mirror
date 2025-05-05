import React from 'react';

import { render, screen } from '@testing-library/react';

import EmptyState from '../../empty-state';
import { type Width } from '../../types';

const widths: Width[] = ['narrow', 'wide'];

const widthValues = {
	narrow: '19pc', // 304px
	wide: '29pc', // 464px
};

describe('<EmptyState width />', () => {
	it('should default to wide', () => {
		render(<EmptyState header="hello" testId="test" />);
		const element = screen.getByTestId('test');
		expect(element).toHaveStyle(`max-width: ${widthValues.wide}`);
	});

	widths.forEach((width) => {
		describe(`with ${width} setting`, () => {
			it('should support width', () => {
				render(<EmptyState width={width} header="hello" testId="test" />);
				const element = screen.getByTestId('test');
				expect(element).toHaveStyle(`max-width: ${widthValues[width]}`);
			});
		});
	});
});
