import React from 'react';

import { render, screen } from '@testing-library/react';

import { backgroundDefaultCssVar, borderRadiusCssVar, textDefaultCssVar } from '../../../constants';
import * as tagStyles from '../../../styles';
import BaseTag from '../../internal/shared/base';
import getCSSVar from '../_utils/get-css-var';

describe('<BaseTag />', () => {
	describe('border radius', () => {
		it('should be determined by the css variable', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyle(`border-radius: var(${borderRadiusCssVar})`);
		});

		it('should use the default border radius', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveCompiledCss({
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
				borderRadius: '3px',
			});
		});

		it('should be configurable using appearance', () => {
			render(
				<BaseTag contentElement={<span>Hello world</span>} appearance="rounded" testId="tag" />,
			);

			const tag = screen.getByTestId('tag');
			expect(tag).toHaveCompiledCss({ borderRadius: '10px' });
		});
	});

	describe('tag color', () => {
		const tagColors = [['standard'], ['blueLight']] as const;

		it('should be determined by css variables', () => {
			render(<BaseTag contentElement={<span>Hello world</span>} testId="tag" />);
			const tag = screen.getByTestId('tag');
			expect(tag).toHaveStyle({
				backgroundColor: `var(${backgroundDefaultCssVar})`,
			});

			expect(tag).toHaveStyle(`color: var(${textDefaultCssVar})`);
		});

		it.each(tagColors)('should be configured by the color prop (color="%s")', (tagColor) => {
			render(<BaseTag color={tagColor} contentElement={<span>Hello world</span>} testId="tag" />);
			const tag = screen.getByTestId('tag');

			expect(getCSSVar(tag, backgroundDefaultCssVar)).toBe(tagStyles.backgroundColors[tagColor]);

			expect(getCSSVar(tag, textDefaultCssVar)).toBe(tagStyles.textColors[tagColor]);
		});
	});
});
