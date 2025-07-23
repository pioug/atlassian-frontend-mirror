import React from 'react';

import { render, screen } from '@testing-library/react';

import { Spotlight } from './index';

const testId = 'spotlight';

describe('Spotlight', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Spotlight testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should find Spotlight by its testid', async () => {
		render(<Spotlight testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});
});
