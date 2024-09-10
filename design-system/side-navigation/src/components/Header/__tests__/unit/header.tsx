import React from 'react';

import { render, screen } from '@testing-library/react';

import Header from '../../index';

describe('<Header />', () => {
	it('is findable by testId', () => {
		const textContent = 'Header Content';

		render(<Header testId="header-testid">{textContent}</Header>);

		expect(screen.getByTestId('header-testid')).toHaveTextContent(textContent);
	});
});
