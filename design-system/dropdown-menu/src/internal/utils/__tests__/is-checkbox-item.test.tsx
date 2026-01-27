import React from 'react';

import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import { ButtonItem } from '@atlaskit/menu';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import isCheckboxItem from '../is-checkbox-item';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('#isCheckboxItem', () => {
	cases(
		'should return true for checkboxitems with in browsers with voiceover support',
		async ({ role, text }: { role: string; text: string }) => {
			const { getByRole } = render(
				<ButtonItem role={role} aria-checked={true}>
					{text}
				</ButtonItem>,
			);
			expect(isCheckboxItem(getByRole(role))).toBe(true);
		},
		[
			{
				name: 'Button with role checkbox',
				role: 'checkbox',
				text: 'fake checkbox',
			},
			{
				name: 'Button with role menuitemcheckbox',
				role: 'menuitemcheckbox',
				text: 'fake menuitemcheckbox',
			},
		],
	);

	it('should return false for non-checkboxitems with in browsers with voiceover support', () => {
		const text = 'button';
		const { getByRole } = render(<ButtonItem>{text}</ButtonItem>);

		expect(isCheckboxItem(getByRole('button'))).toBe(false);
	});
});
