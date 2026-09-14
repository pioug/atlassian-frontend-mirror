import React from 'react';

import { render } from '@atlassian/testing-library';

import { axe } from '@af/accessibility-testing';

import { Manager } from '../../manager';
import { Popper } from '../../popper';
import { Reference } from '../../reference';

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
