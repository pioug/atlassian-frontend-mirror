import React from 'react';

import { render, screen } from '@testing-library/react';

import { xcss } from '../../../xcss/xcss';
import { Hide } from '../../hide';
import { Show } from '../../show';

const showHideStyles = xcss({
	textTransform: 'uppercase',
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('should apply styles with `xcss`', () => {
	const text = 'text';

	it('Show', () => {
		render(
			<Show above="xs" xcss={showHideStyles}>
				{text}
			</Show>,
		);

		const styles = getComputedStyle(screen.getByText(text));
		expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
	});

	it('Hide', () => {
		render(
			<Hide below="xl" xcss={showHideStyles}>
				{text}
			</Hide>,
		);

		const styles = getComputedStyle(screen.getByText(text));
		expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
	});
});
