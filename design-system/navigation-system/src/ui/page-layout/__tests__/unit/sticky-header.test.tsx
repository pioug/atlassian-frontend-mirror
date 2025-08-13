import React from 'react';

import { cssMap } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { Main } from '../../main/main';
import { MainStickyHeader } from '../../main/main-sticky-header';

const styles = cssMap({ bgColor: { backgroundColor: 'var(--ds-surface)' } });

describe('main sticky header', () => {
	window.matchMedia = jest.fn().mockImplementation((query) => ({
		media: query,
		matches: false,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	}));

	it('should be sticky', () => {
		render(<MainStickyHeader>sticky content</MainStickyHeader>);
		const element = screen.getByText('sticky content');

		expect(element).toHaveCompiledCss('position', 'sticky');
	});

	it('should stick to the top of the container', () => {
		render(
			<Main>
				<MainStickyHeader>sticky content</MainStickyHeader>
			</Main>,
		);
		const element = screen.getByText('sticky content');

		expect(element).toHaveCompiledCss('insetBlockStart', '0');
	});

	it('should expose xcss prop', () => {
		render(<MainStickyHeader xcss={styles.bgColor}>sticky content</MainStickyHeader>);
		const element = screen.getByText('sticky content');

		expect(element).toHaveCompiledCss('backgroundColor', 'var(--ds-surface)');
	});
});
