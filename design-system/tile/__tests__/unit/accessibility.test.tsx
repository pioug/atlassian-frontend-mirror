import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Basic from '../../examples/basic';
import Emojis from '../../examples/emojis';

it('Tile should pass axe audit', async () => {
	const { container } = render(<Basic />);
	await axe(container);
});

it('Emoji tiles should pass axe audit', async () => {
	const { container } = render(<Emojis />);
	await axe(container);
});
