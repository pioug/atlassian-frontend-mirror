import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { ToolbarButton } from '../ToolbarButton';

describe('ToolbarButton accessibility attributes', () => {
	it('sets aria-pressed and data-selected for selected toggle buttons', async () => {
		render(<ToolbarButton iconBefore={<span />} isSelected label="Bold" />);

		const button = screen.getByRole('button', { name: 'Bold' });
		expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(button).toHaveAttribute('data-selected', 'true');
		await expect(document.body).toBeAccessible();
	});

	it('does not set aria-pressed for selected popup trigger buttons', async () => {
		render(
			<ToolbarButton
				aria-expanded
				aria-haspopup
				iconBefore={<span />}
				isSelected
				label="More formatting"
			/>,
		);

		const button = screen.getByRole('button', { name: 'More formatting' });
		expect(button).not.toHaveAttribute('aria-pressed');
		expect(button).toHaveAttribute('data-selected', 'true');
		await expect(document.body).toBeAccessible();
	});
});
