import React from 'react';

import { render, screen } from '@testing-library/react';

import { Aside } from '../../aside';

it('should set the default aside width to the default value if width is not provided', () => {
	render(<Aside testId="aside">aside</Aside>);

	expect(screen.getByTestId('aside')).toHaveStyle({ '--n_asDw': 'clamp(0px, 330px, 50vw)' });
});

it('should set the default aside width to the provided value', () => {
	render(
		<Aside testId="aside" defaultWidth={199}>
			aside
		</Aside>,
	);

	expect(screen.getByTestId('aside')).toHaveStyle({ '--n_asDw': 'clamp(0px, 199px, 50vw)' });
});
