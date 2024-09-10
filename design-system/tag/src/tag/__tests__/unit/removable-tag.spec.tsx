import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { cssVar } from '../../../constants';
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

			expect(getCSSVar(tag, cssVar.color.background.hover)).toBe(
				styles.removalHoverBackgroundColors,
			);

			expect(getCSSVar(tag, cssVar.color.background.active)).toBe(
				styles.removalActiveBackgroundColors,
			);

			expect(getCSSVar(tag, cssVar.color.text.default)).toBe(styles.removalTextColors);
		});
	});
});
