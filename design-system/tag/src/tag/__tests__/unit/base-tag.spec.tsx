import React from 'react';

import { render, screen } from '@testing-library/react';

import { cssVar } from '../../../constants';
import * as tagStyles from '../../../styles';
import BaseTag from '../../internal/shared/base';
import getCSSVar from '../_utils/get-css-var';

describe('<BaseTag />', () => {
	describe('border radius', () => {
		it('should be determined by the css variable', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyleDeclaration('border-radius', `var(${cssVar.borderRadius})`);
		});

		it('should use the default border radius', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			const styles = getComputedStyle(tag);
			expect(styles.getPropertyValue(cssVar.borderRadius)).toBe(tagStyles.borderRadius.default);
		});

		it('should be configurable using appearance', () => {
			render(
				<BaseTag contentElement={<span>Hello world</span>} appearance="rounded" testId="tag" />,
			);

			const tag = screen.getByTestId('tag');
			const styles = getComputedStyle(tag);
			expect(styles.getPropertyValue(cssVar.borderRadius)).toBe(tagStyles.borderRadius.rounded);
		});
	});

	describe('tag color', () => {
		const tagColors = [['standard'], ['blueLight']] as const;

		it('should be determined by css variables', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);
			const tag = screen.getByTestId('tag');

			expect(tag).toHaveStyleDeclaration(
				'background-color',
				`var(${cssVar.color.background.default})`,
			);

			expect(tag).toHaveStyleDeclaration('color', `var(${cssVar.color.text.default})`);
		});

		it.each(tagColors)('should be configured by the color prop (color="%s")', (tagColor) => {
			render(<BaseTag color={tagColor} contentElement={<span>Hello world</span>} testId="tag" />);
			const tag = screen.getByTestId('tag');

			expect(getCSSVar(tag, cssVar.color.background.default)).toBe(
				tagStyles.backgroundColors[tagColor],
			);

			expect(getCSSVar(tag, cssVar.color.text.default)).toBe(tagStyles.textColors[tagColor]);
		});
	});
});
