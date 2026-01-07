import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import FocusRing from '../../src';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('focus ring', () => {
	it('Basic focus ring with button should pass axe audit', async () => {
		const { container } = render(
			<FocusRing>
				<button type="button">Native Button</button>
			</FocusRing>,
		);
		await axe(container);
	});
});
