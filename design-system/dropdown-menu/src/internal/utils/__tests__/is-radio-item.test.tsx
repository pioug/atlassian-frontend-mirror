import React from 'react';

import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import { ButtonItem } from '@atlaskit/menu';

import isRadioItem from '../is-radio-item';

describe('#isRadioItem', () => {
	cases(
		'should return true for radioitems with in browsers with voiceover support',
		async ({ role, text }: { role: string; text: string }) => {
			const { getByRole } = render(
				<ButtonItem role={role} aria-checked={true}>
					{text}
				</ButtonItem>,
			);
			expect(isRadioItem(getByRole(role))).toBe(true);
		},
		[
			{ name: 'Button with role radio', role: 'radio', text: 'fake radio' },
			{
				name: 'Button with role menuitemradio',
				role: 'menuitemradio',
				text: 'fake menuitemradio',
			},
		],
	);

	it('should return false for non-radioitems with in browsers with voiceover support', () => {
		const text = 'button';
		const { getByRole } = render(<ButtonItem>{text}</ButtonItem>);

		expect(isRadioItem(getByRole('button'))).toBe(false);
	});
});
