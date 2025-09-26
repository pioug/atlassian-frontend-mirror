import React from 'react';

import { render, screen } from '@testing-library/react';

import BaseTag from '../../internal/shared/base';

describe('<BaseTag />', () => {
	describe('border radius', () => {
		it('should be determined by the css variable', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyle(`border-radius: var(--ds-radius-small,4px)`);
		});

		it('should use the default border radius', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyle(`border-radius: var(--ds-radius-small,4px)`);
		});

		it('should be configurable using appearance', () => {
			render(
				<BaseTag contentElement={<span>Hello world</span>} appearance="rounded" testId="tag" />,
			);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyle(`border-radius: var(--ds-radius-small,4px)`);
		});
	});

	describe('tag color', () => {
		const tagColors: { color: 'standard' | 'green'; rgb: string }[] = [
			{ color: 'standard', rgb: '#b7b9be' },
			{ color: 'green', rgb: '#4bce97' },
		];

		it.each(tagColors)('should be configured by the color prop (color="%s")', (tagColor) => {
			render(
				<BaseTag color={tagColor.color} contentElement={<span>Hello world</span>} testId="tag" />,
			);

			const tag = screen.getByTestId('tag');

			expect(tag).toHaveStyle(`border-color: ${tagColor.rgb}`);
		});
	});
});
