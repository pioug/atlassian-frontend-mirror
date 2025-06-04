import React from 'react';

import { render, screen } from '@testing-library/react';

import Lozenge from '@atlaskit/lozenge';

describe('Lozenge', () => {
	it('@atlaskit/lozenge should have Compiled styles', () => {
		render(<Lozenge testId="test">Hello</Lozenge>);

		const lozenge = screen.getByTestId('test');
		expect(lozenge).toBeInTheDocument();

		expect(lozenge).toHaveAttribute('class', expect.stringMatching(/^(_[a-z0-9]{8}\s?)+$/));
	});
});
