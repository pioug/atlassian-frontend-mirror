import React from 'react';

import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import { axe } from '@af/accessibility-testing';

import TextArea from '../../index';

cases(
	'Textarea variants should pass aXe audit',
	async ({ name, ...props }: { name: string }) => {
		const { container } = render(
			<>
				<label htmlFor="standard">Example</label>
				<TextArea name="standard" id="standard" {...props} />
			</>,
		);
		await axe(container);
	},
	[
		{ name: 'base' },
		{ name: 'disabled', isDisabled: true },
		{ name: 'compact', isCompact: true },
		{ name: 'invalid', isInvalid: true },
		{ name: 'monospaced', isMonospaced: true },
		{ name: 'required', isRequired: true },
		// Appearances
		{ name: 'subtle', appearance: 'subtle' },
		{ name: 'subtle-disabled', appearance: 'subtle-disabled' },
		{ name: 'none', appearance: 'none' },
		{ name: 'none-disabled', appearance: 'none-disabled' },
	],
);
