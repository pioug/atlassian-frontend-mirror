import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Heading from '../../src/heading';

it('Basic Heading should not fail aXe audit', async () => {
	const { container } = render(
		<Heading size="xxlarge" color="color.text.inverse">
			inverse
		</Heading>,
	);
	await axe(container);
});

it('Basic Heading should not fail aXe audit if size only is applied', async () => {
	const { container } = render(
		<>
			<Heading size="small">small</Heading>
			<Heading size="small">small</Heading>
		</>,
	);
	await axe(container);
});

it('Basic size is correct', async () => {
	const { container } = render(
		<Heading as="div" size="xxlarge" color="color.text.inverse">
			inverse
		</Heading>,
	);
	await axe(container);
});
