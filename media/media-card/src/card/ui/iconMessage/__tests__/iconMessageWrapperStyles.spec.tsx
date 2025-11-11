import React from 'react';
import { render, screen } from '@testing-library/react';

import { IconMessageWrapper } from '../iconMessageWrapper';

describe('Icon message wrapper styles', () => {
	const iconMessageWrapperTestId = 'icon-message-wrapper';
	it('should render animations if animated is true', () => {
		render(<IconMessageWrapper animated={true} />);

		const wrapper = screen.getByTestId(iconMessageWrapperTestId);
		const styles = window.getComputedStyle(wrapper);

		expect(styles.getPropertyValue('animation-iteration-count')).toBe('infinite');
	});

	it('should render font-size if reducedFont is true', () => {
		render(<IconMessageWrapper reducedFont={true} />);

		screen.getByTestId(iconMessageWrapperTestId);
		const styles = getComputedStyle(screen.getByTestId(iconMessageWrapperTestId));

		expect(styles.getPropertyValue('font-weight')).toBe('var(--ds-font-weight-medium,500)');
	});
});
