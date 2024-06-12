import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Spinner from '../../spinner';

it('Basic Spinner should not fail aXe audit', async () => {
	const { container } = render(<Spinner interactionName="load" />);
	await axe(container);
});
