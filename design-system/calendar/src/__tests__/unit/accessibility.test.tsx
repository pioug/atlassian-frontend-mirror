import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Calendar from '../../index';

it('Calendar should pass an aXe audit', async () => {
	const { container } = render(<Calendar />);
	await axe(container);
});
