import React from 'react';

import { render, screen } from '@testing-library/react';

import PanelSystem from '../../main';

const testId = 'panel-system';

describe('PanelSystem', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<PanelSystem testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should find PanelSystem by its testid', async () => {
		render(<PanelSystem testId={testId} />);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
