import React from 'react';

import { render } from '@atlassian/testing-library';

import AddIcon from '../../../../core/add';

describe('New icons', () => {
	it('New icon with empty label string should not fail aXe audit', async () => {
		const { container } = render(<AddIcon label="" />);
		await expect(container).toBeAccessible();
	});

	it('New icon with label string should not fail aXe audit', async () => {
		const { container } = render(<AddIcon label="Like" />);
		await expect(container).toBeAccessible();
	});
});
