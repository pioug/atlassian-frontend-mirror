import React from 'react';
import { render, screen } from '@testing-library/react';

import { ActionsBarWrapper } from '../actionsBarWrapper';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(false),
}));

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

	describe('when platform_media_a11y_suppression_fixes is enabled', () => {
		beforeEach(() => {
			(fg as jest.Mock).mockImplementation((flag: string) => {
				if (flag === 'platform_media_a11y_suppression_fixes') {
					return true;
				}
				return false;
			});
		});

		afterEach(() => {
			(fg as jest.Mock).mockReset();
		});

		it('Opacity should be 0 if Action Bar is not fixed', () => {
			render(<ActionsBarWrapper />);
			const wrapper = screen.getByTestId('actionsBarWrapper');
			const styles = getComputedStyle(wrapper);
			expect(styles['opacity']).toBe('0');
		});

		it('Opacity should be 1 if Action Bar is fixed', () => {
			render(<ActionsBarWrapper isFixed={true} />);
			const wrapper = screen.getByTestId('actionsBarWrapper');
			const styles = getComputedStyle(wrapper);
			expect(styles['opacity']).toBe('1');
		});

		it('should have role="presentation" and tabIndex={-1}', () => {
			render(<ActionsBarWrapper />);
			const wrapper = screen.getByTestId('actionsBarWrapper');
			expect(wrapper).toHaveAttribute('role', 'presentation');
			expect(wrapper).toHaveAttribute('tabindex', '-1');
		});
	});

});
