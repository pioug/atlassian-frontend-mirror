import React from 'react';

import { axe } from '@af/accessibility-testing/jest-axe';
import { render } from '@atlassian/testing-library/testing-library/react';

import { AtlassianLogo } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Logo basic accessibility unit tests audit with jest-axe', () => {
	it('Logo should not fail an aXe audit', async () => {
		const { container } = render(<AtlassianLogo appearance="brand" />);
		await axe(container);
	});
});
