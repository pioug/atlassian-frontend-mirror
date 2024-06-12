import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import NestedSideNav from '../../../examples/00-nested-side-navigation';
import RBDSideNav from '../../../examples/01-sidebar-with-rbd';
import { SideNavigation } from '../../index';

it('SideNavigation should pass basic aXe audit', async () => {
	const { container } = render(
		<SideNavigation label="SideNav test">
			<p>content</p>
		</SideNavigation>,
	);
	await axe(container);
});

// documentation examples

it('Basic Nested side nav example should pass an aXe audit', async () => {
	const { container } = render(<NestedSideNav />);
	await axe(container);
});

it('RBD example should pass an aXe audit', async () => {
	const { container } = render(<RBDSideNav />);
	await axe(container);
});
