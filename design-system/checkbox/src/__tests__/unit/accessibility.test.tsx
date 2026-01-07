import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Checkbox from '../../checkbox';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Checkbox Accessibility jest-axe', () => {
	const props = {
		value: 'Basic checkbox',
		label: 'Basic checkbox',
		name: 'checkbox-basic',
		testId: 'the-checkbox',
	};

	it('Checkbox should not fail an aXe audit', async () => {
		const { container } = render(<Checkbox {...props} />);
		await axe(container);
	});

	it('Checked Checkbox should not fail an aXe audit', async () => {
		const { container } = render(<Checkbox {...props} isChecked />);
		await axe(container);
	});

	it('Disabled Checkbox should not fail an aXe audit', async () => {
		const { container } = render(<Checkbox {...props} isDisabled />);
		await axe(container);
	});

	it('Invalid Checkbox should not fail an aXe audit', async () => {
		const { container } = render(<Checkbox {...props} isInvalid />);
		await axe(container);
	});
});
