import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../state-manager';

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

const TEST_ID = 'react-select';

function renderSelect({ onMenuOpen = __noop }: { onMenuOpen?: () => void } = {}) {
	return render(
		<Select
			testId={TEST_ID}
			options={options}
			onInputChange={__noop}
			onMenuOpen={onMenuOpen}
			onMenuClose={__noop}
			aria-label="choose option"
		/>,
	);
}

function getControl(): HTMLElement {
	return screen.getByTestId(`${TEST_ID}-select--control`);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('openMenuAfterClick (flag ON)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('opens after click, not during the preceding pointer or mouse events', () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		fireEvent.pointerUp(control, { button: 0 });
		fireEvent.mouseUp(control, { button: 0 });
		expect(onMenuOpen).not.toHaveBeenCalled();

		fireEvent.click(control, { button: 0 });
		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	it('opens only once after multiple mousedown events before click', () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		fireEvent.mouseDown(control, { button: 0 });
		fireEvent.click(control, { button: 0 });

		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});

	it('opens once for a complete user click', async () => {
		const onMenuOpen = jest.fn();
		renderSelect({ onMenuOpen });

		await userEvent.click(getControl());

		expect(onMenuOpen).toHaveBeenCalledTimes(1);
	});
});
