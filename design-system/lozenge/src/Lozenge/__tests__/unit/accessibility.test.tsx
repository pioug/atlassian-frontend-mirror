import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Lozenge from '../../index';

it('Default Lozenge should not fail basic aXe audit', async () => {
	const { container } = render(<Lozenge>Default</Lozenge>);

	await axe(container);
});

it('Bold Lozenge should not fail basic aXe audit', async () => {
	const { container } = render(<Lozenge isBold>isBold</Lozenge>);

	await axe(container);
});
