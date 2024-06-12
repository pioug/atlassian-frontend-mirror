import React from 'react';

import { render, screen } from '@testing-library/react';

import Lozenge from '../../../index';

describe('Lozenge', () => {
	it('renders', () => {
		render(<Lozenge testId="test">Hello</Lozenge>);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});
});
