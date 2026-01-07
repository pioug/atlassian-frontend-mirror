import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { AtlassianLogo } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Logo basic accessibility unit tests audit with jest-axe', () => {
	it('Logo should not fail an aXe audit', async () => {
		const { container } = render(<AtlassianLogo appearance="brand" />);
		await axe(container);
	});
});
