import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import * as Actions from '../../../../view/BlockCard/components/Action';
import { ActionList } from '../../../../view/BlockCard/components/ActionList';

const actionSpy = jest.spyOn(Actions, 'Action').mockReturnValue(<div>Actions</div>);

describe('ActionList', () => {
	beforeEach(() => jest.clearAllMocks());

	const actionsList: Array<Actions.ActionProps> = [
		{
			id: 'action 1',
			text: 'action 1',
			promise: () => {
				return new Promise((resolve) => {});
			},
		},
		{
			id: 'action 2',
			text: 'action 2',
			promise: () => {
				return new Promise((resolve) => {});
			},
		},
		{
			id: 'action 3',
			text: 'action 3',
			promise: () => {
				return new Promise((resolve) => {});
			},
		},
		{
			id: 'action 4',
			text: 'action 4',
			promise: () => {
				return new Promise((resolve) => {});
			},
		},
	];

	test('should render first two actions to show in buttons', () => {
		render(<ActionList items={actionsList} />);

		expect(actionSpy).toBeCalledTimes(2);
	});

	test('should open dropdown with hidden actions on clicking of trigger', () => {
		const { getByTestId } = render(<ActionList items={actionsList} />);
		const popupTrigger = getByTestId('dropdown-trigger');

		act(() => {
			fireEvent.click(popupTrigger);
		});
		const popupMenu = getByTestId('dropdown-menu');

		expect(popupMenu).toBeDefined();
	});

	test('should have no dropdown when only 2 actions present', () => {
		const newActions = actionsList.slice(0, 2);
		const { queryByTestId } = render(<ActionList items={newActions} />);

		const popupTrigger = queryByTestId('dropdown-trigger');

		expect(popupTrigger).not.toBeInTheDocument();
	});
});
