import React from 'react';

import { render } from '@testing-library/react';

import { ButtonItem } from '@atlaskit/menu';

import isRadioItem from '../is-radio-item';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('#isRadioItem', () => {
	it('should return true for radioitems with in browsers with voiceover support', () => {
		const testCases = [
			{ role: 'radio', text: 'fake radio' },
			{ role: 'menuitemradio', text: 'fake menuitemradio' },
		];

		testCases.forEach(({ role, text }) => {
			const { getByRole, unmount } = render(
				<ButtonItem role={role} aria-checked={true}>
					{text}
				</ButtonItem>,
			);
			expect(isRadioItem(getByRole(role))).toBe(true);
			unmount();
		});
	});

	it('should return false for non-radioitems with in browsers with voiceover support', () => {
		const text = 'button';
		const { getByRole } = render(<ButtonItem>{text}</ButtonItem>);

		expect(isRadioItem(getByRole('button'))).toBe(false);
	});
});
