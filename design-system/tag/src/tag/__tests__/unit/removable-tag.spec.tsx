import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import {
	backgroundActiveCssVar,
	backgroundHoverCssVar,
	textDefaultCssVar,
} from '../../../constants';
import * as styles from '../../../styles';
import RemovableTag from '../../internal/removable';
import getCSSVar from '../_utils/get-css-var';

describe('<RemovableTag />', () => {
	describe('removal indicator', () => {
		it('should render a remove button', () => {
			render(<RemovableTag text="" testId="tag" />);
			expect(screen.getByTestId('close-button-tag')).toBeInTheDocument();
		});

		it('should apply css vars on hover', () => {
			render(<RemovableTag text="" testId="tag" />);
			const tag = screen.getByTestId('tag');
			const removeButton = screen.getByTestId('close-button-tag');
			fireEvent.mouseOver(removeButton);

			expect(getCSSVar(tag, backgroundHoverCssVar)).toBe(styles.removalHoverBackgroundColors);

			expect(getCSSVar(tag, backgroundActiveCssVar)).toBe(styles.removalActiveBackgroundColors);

			expect(getCSSVar(tag, textDefaultCssVar)).toBe(styles.removalTextColors);
		});
	});
});
