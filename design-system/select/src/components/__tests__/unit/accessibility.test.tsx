import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import AtlaskitSelect from '../../..';

const OPTIONS = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

describe('Select', () => {
	// Basic test
	// TODO re-enable this test once we fix accessibility issue on select
	it.skip('Basic select should pass basic axe audit', async () => {
		const { container } = render(<AtlaskitSelect options={OPTIONS} menuIsOpen />);
		await axe(container);
	});
});
