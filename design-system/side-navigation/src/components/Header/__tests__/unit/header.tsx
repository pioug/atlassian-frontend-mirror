import React from 'react';

import { render } from '@testing-library/react';

import Header from '../../index';

describe('<Header />', () => {
	it('is findable by testId', () => {
		const textContent = 'Header Content';

		const { getByTestId } = render(<Header testId="header-testid">{textContent}</Header>);

		expect(getByTestId('header-testid').textContent).toBe(textContent);
	});
});
