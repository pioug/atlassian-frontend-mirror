import React from 'react';

import { render, screen } from '@testing-library/react';

import { SpotlightShowMoreControl } from './index';

const testId = 'spotlight';

describe('SpotlightShowMoreControl', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(<SpotlightShowMoreControl testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('finds Spotlight by its testid', async () => {
		render(<SpotlightShowMoreControl testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<SpotlightShowMoreControl testId={testId} ref={ref} />);
		expect(ref.current).toBeDefined();
		expect(ref.current?.getAttribute('data-testid')).toEqual(testId);
	});
});
