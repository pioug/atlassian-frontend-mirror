import React from 'react';
import { render, screen } from '@testing-library/react';

import { ActionsBarWrapper } from '../actionsBarWrapper';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Actions Bar Styles', () => {
	it('Opacity should be 0 if Action Bar is not fixed', () => {
		render(<ActionsBarWrapper />);

		const wrapper = screen.getByTestId('actionsBarWrapper');
		const styles = getComputedStyle(wrapper);

		expect(styles['opacity']).toBe('0');
	});

	it('Opactiy should be 1 if Action Bar is fixed', () => {
		render(<ActionsBarWrapper isFixed={true} />);

		const wrapper = screen.getByTestId('actionsBarWrapper');
		const styles = getComputedStyle(wrapper);

		expect(styles['opacity']).toBe('1');
	});
});
