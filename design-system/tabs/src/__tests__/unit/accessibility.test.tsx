import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import CustomTabs from '../../../examples/constellation/tab-custom';
import ControlledTabs from '../../../examples/constellation/tabs-controlled';
import DefaultTabs from '../../../examples/constellation/tabs-default';

it('Tabs should pass axe audit', async () => {
	const { container } = render(<DefaultTabs />);
	await axe(container);
});

it('Controlled tabs should pass axe audit', async () => {
	const { container } = render(<ControlledTabs />);
	await axe(container);
});

it('Custom tabs should pass axe audit', async () => {
	const { container } = render(<CustomTabs />);
	await axe(container);
});
