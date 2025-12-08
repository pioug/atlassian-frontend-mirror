import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { Manager, Popper, Reference } from '../../index';

it('Popper should pass axe audit', async () => {
	const { container } = render(
		<Manager>
			<Reference>
				{({ ref }) => (
					<button type="button" ref={ref}>
						Reference element
					</button>
				)}
			</Reference>
		<Popper placement="right">
			{({ ref }) => <div ref={ref}>This text is a popper placed to the right</div>}
		</Popper>
		</Manager>,
	);
	await axe(container);
});
