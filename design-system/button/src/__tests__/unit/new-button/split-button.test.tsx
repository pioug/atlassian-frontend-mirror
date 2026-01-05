import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import SettingsIcon from '@atlaskit/icon/core/settings';

import { SplitButton } from '../../../new-button/containers/split-button';
import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';

describe('SplitButton', () => {
	const primaryActionClickMock = jest.fn();
	const secondaryActionClickMock = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should allow clicks for both actions when secondary action is icon button', () => {
		render(
			<SplitButton>
				<Button onClick={primaryActionClickMock}>Primary action</Button>
				<IconButton
					onClick={secondaryActionClickMock}
					icon={SettingsIcon}
					label="Secondary action"
				/>
			</SplitButton>,
		);

		const actions = screen.getAllByRole('button');
		fireEvent.click(actions[0]);
		fireEvent.click(actions[1]);

		expect(primaryActionClickMock).toHaveBeenCalledTimes(1);
		expect(secondaryActionClickMock).toHaveBeenCalledTimes(1);
	});

	it('should allow clicks for both actions when disabled', () => {
		render(
			<SplitButton isDisabled>
				<Button onClick={primaryActionClickMock}>Primary action</Button>
				<IconButton
					onClick={secondaryActionClickMock}
					icon={SettingsIcon}
					label="Secondary action"
				/>
			</SplitButton>,
		);

		const actions = screen.getAllByRole('button');
		fireEvent.click(actions[0]);
		fireEvent.click(actions[1]);

		expect(primaryActionClickMock).toHaveBeenCalledTimes(0);
		expect(secondaryActionClickMock).toHaveBeenCalledTimes(0);
	});
});
