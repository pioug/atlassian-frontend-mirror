import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicDrawer from '../../../../examples/constellation/drawer-default';

it('Basic drawer should pass axe audit', async () => {
	const { container } = render(<BasicDrawer />);
	fireEvent.click(screen.getByText('Open drawer'));
	expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
	await axe(container);
});
