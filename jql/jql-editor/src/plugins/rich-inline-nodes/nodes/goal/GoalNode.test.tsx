import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { DiProvider, injectable } from 'react-magnetic-di';

import { useHydratedGoal } from '../../../../state';
import type { HydratedGoal } from '../../../../ui/jql-editor/types';

import { GoalNode } from './goal-node';

const useHydratedGoalMock = jest.fn<[HydratedGoal | undefined, any], []>();
const deps = [injectable(useHydratedGoal, useHydratedGoalMock)];

describe('GoalNode', () => {
	const renderGoalNode = ({
		name = 'Goal Name',
		error = false,
		selected = false,
	}: {
		error?: boolean;
		name?: string;
		restrictedGoal?: boolean;
		selected?: boolean;
	}) =>
		render(
			<IntlProvider locale="en">
				<DiProvider use={deps}>
					<GoalNode id="id" fieldName="goal" name={name} error={error} selected={selected} />
				</DiProvider>
			</IntlProvider>,
		);

	beforeEach(() => {
		useHydratedGoalMock.mockReturnValue([
			{
				id: 'goal-1',
				name: 'Test Goal',
				status: 'ON_TRACK',
				iconKey: 'OBJECTIVE',
				type: 'goal',
			},
			undefined,
		]);
	});

	it('is accessible', async () => {
		const { getByText } = renderGoalNode({});
		await expect(getByText('Goal Name')).toBeAccessible();
	});

	it('displays the correct text', () => {
		const { getByText } = renderGoalNode({ name: 'Custom Name' });
		expect(getByText('Custom Name')).toBeInTheDocument();
	});

	it('displays the goal icon', () => {
		const { container } = renderGoalNode({});
		expect(container.querySelector('svg')).toBeInTheDocument();
	});
});
