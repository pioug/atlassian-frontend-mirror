/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { cssMap } from '@atlaskit/css';

import { Hide } from '../../hide';
import { Show } from '../../show';

const styles = cssMap({
	uppercase: {
		textTransform: 'uppercase',
	},
});

describe('should apply styles with `xcss`', () => {
	const text = 'text';

	it('Show', () => {
		render(
			<Show above="xs" xcss={styles.uppercase}>
				{text}
			</Show>,
		);

		expect(screen.getByText(text)).toHaveCompiledCss({ textTransform: 'uppercase' });
	});

	it('Hide', () => {
		render(
			<Hide below="xl" xcss={styles.uppercase}>
				{text}
			</Hide>,
		);

		expect(screen.getByText(text)).toHaveCompiledCss({ textTransform: 'uppercase' });
	});
});
