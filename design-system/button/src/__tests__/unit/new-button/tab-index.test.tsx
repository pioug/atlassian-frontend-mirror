import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
	it(`${name} should not add unnecessary \`tabIndex={0}\` to enable focus`, async () => {
		render(<Component testId={name}>Button</Component>);

		expect(screen.getByTestId(name)).not.toHaveAttribute('tabIndex');
	});

	it(`${name} should not add unnecessary \`tabIndex={-1}\` to disable focus`, async () => {
		render(
			<Component testId={name} isDisabled>
				Button
			</Component>,
		);

		expect(screen.getByTestId(name)).not.toHaveAttribute('tabIndex');
	});
});
