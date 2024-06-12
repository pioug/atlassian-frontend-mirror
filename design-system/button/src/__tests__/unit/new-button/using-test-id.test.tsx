import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
	it(`${name} should render test ID`, async () => {
		render(<Component testId={name}>Button</Component>);

		expect(screen.getByTestId(name)).toBeInTheDocument();
	});
});
