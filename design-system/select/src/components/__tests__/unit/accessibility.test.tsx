import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import AtlaskitSelect from '../../../index';

const OPTIONS = [
	{ label: '0', value: 'zero' },
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Select', () => {
	it('Basic select should pass basic axe audit', async () => {
		const { container } = render(
			<AtlaskitSelect options={OPTIONS} menuIsOpen label="Basic select" />,
		);
		await axe(container);
	});
});
