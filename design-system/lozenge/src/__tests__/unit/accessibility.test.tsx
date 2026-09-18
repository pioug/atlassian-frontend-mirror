import React from 'react';

import { axe } from '@af/accessibility-testing';
import { render } from '@atlassian/testing-library';

import Lozenge from '../../lozenge';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Lozenge', () => {
	it('Default Lozenge should not fail basic aXe audit', async () => {
		const { container } = render(<Lozenge>Default</Lozenge>);

		await axe(container);
	});

	it('Bold Lozenge should not fail basic aXe audit', async () => {
		const { container } = render(<Lozenge isBold>isBold</Lozenge>);

		await axe(container);
	});
});
