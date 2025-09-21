import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightDismissControl } from './index';

const testId = 'spotlight';

describe('SpotlightDismissControl', () => {
	it('captures and report a11y violations', async () => {
		const ref = React.createRef<HTMLButtonElement>();

		const { container } = render(<SpotlightDismissControl ref={ref} testId={testId} />);

		await expect(container).toBeAccessible();
		await expect(ref.current).toHaveAttribute('aria-label', 'Dismiss');
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightDismissControl testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<SpotlightDismissControl testId={testId} ref={ref} />);
		expect(ref.current).toBeDefined();
		expect(ref.current?.getAttribute('data-testid')).toEqual(testId);
	});
});
