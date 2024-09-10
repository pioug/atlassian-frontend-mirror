import React from 'react';

import { render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { ProgressTracker, type Stages } from '../../index';
import {
	varSpacing,
	varTransitionDelay,
	varTransitionEasing,
	varTransitionSpeed,
} from '../../internal/constants';
import { type Stage } from '../../types';

const items: Stages = [
	{
		id: '1',
		label: 'Step 1',
		percentageComplete: 0,
		href: '#',
		status: 'current',
	},
	{
		id: '2',
		label: 'Step 2',
		percentageComplete: 0,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '3',
		label: 'Step 3',
		percentageComplete: 0,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '4',
		label: 'Step 4',
		percentageComplete: 0,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '5',
		label: 'Step 5',
		percentageComplete: 0,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '6',
		label: 'Step 6',
		percentageComplete: 0,
		href: '#',
		status: 'unvisited',
	},
];

const completedStages: Stages = [
	{
		id: '1',
		label: 'Step 1',
		percentageComplete: 100,
		href: '#',
		status: 'current',
	},
	{
		id: '2',
		label: 'Step 2',
		percentageComplete: 100,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '3',
		label: 'Step 3',
		percentageComplete: 100,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '4',
		label: 'Step 4',
		percentageComplete: 100,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '5',
		label: 'Step 5',
		percentageComplete: 100,
		href: '#',
		status: 'unvisited',
	},
	{
		id: '6',
		label: 'Step 6',
		percentageComplete: 100,
		href: '#',
		status: 'unvisited',
	},
];

const testBackwardsRenderTransitions = (
	progressTrackerStages: NodeListOf<HTMLLIElement> | HTMLElement[],
) => {
	progressTrackerStages.forEach((stage, index) => {
		const delay = (progressTrackerStages.length - 1 - index) * 50;
		expect(stage).toHaveStyle(`${varTransitionDelay}: ${delay}ms`);
	});
};

const testMultiStepRenderTransitions = (
	progressTrackerStages: NodeListOf<HTMLLIElement> | HTMLElement[],
) => {
	progressTrackerStages.forEach((stage, index) => {
		expect(stage).toHaveStyle(`${varTransitionDelay}: ${index * 50}ms`);
		expect(stage).toHaveStyle(`${varTransitionEasing}: linear`);
	});
};

const testNoOrSingleStepRenderTransitions = (
	progressTrackerStages: NodeListOf<HTMLLIElement> | HTMLElement[],
) => {
	progressTrackerStages.forEach((stage) => {
		expect(stage).toHaveStyle(`${varTransitionDelay}: 0ms`);
		expect(stage).toHaveStyle(`${varTransitionEasing}: cubic-bezier(0.15,1,0.3,1)`);
	});
};

const testNotAnimated = (progressTrackerStages: NodeListOf<HTMLLIElement> | HTMLElement[]) => {
	progressTrackerStages.forEach((stage) => {
		expect(stage).toHaveStyle(`${varTransitionDelay}: 0ms`);
		expect(stage).toHaveStyle(`${varTransitionSpeed}: 0ms`);
	});
};

ffTest.both('platform-progress-tracker-functional-facade', '@atlaskit/progress-tracker', () => {
	it('should render the component', () => {
		render(<ProgressTracker items={items} testId="progress-tracker" />);

		const progressTracker = screen.getByTestId('progress-tracker');
		expect(progressTracker).toBeInTheDocument();
		//eslint-disable-next-line testing-library/no-node-access
		expect(progressTracker.childElementCount).toBe(6);
	});

	it('should have "cosy" spacing style by default', () => {
		render(<ProgressTracker items={items} testId="progress-tracker" />);

		expect(screen.getByTestId('progress-tracker')).toHaveStyle(
			`${varSpacing}: ${token('space.200', '16px')}`,
		);
	});

	it('should apply spacing style to the ul element', () => {
		render(<ProgressTracker items={items} testId="progress-tracker" spacing="compact" />);

		expect(screen.getByTestId('progress-tracker')).toHaveStyle(
			`${varSpacing}: ${token('space.050', '4px')}`,
		);
	});

	it('should not set transition if animated prop is false', () => {
		render(<ProgressTracker items={items} animated={false} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testNotAnimated(progressTrackerStages);
	});

	it('should set initial transition', () => {
		render(<ProgressTracker items={items} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testNoOrSingleStepRenderTransitions(progressTrackerStages);
	});

	it('should set backwards transition', () => {
		const { rerender } = render(<ProgressTracker items={completedStages} />);
		rerender(<ProgressTracker items={items} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testBackwardsRenderTransitions(progressTrackerStages);
	});

	it('should set multistep transition on first render', () => {
		render(<ProgressTracker items={completedStages} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testMultiStepRenderTransitions(progressTrackerStages);
	});

	it('should set multistep transition when multiple stages are completed', () => {
		const { rerender } = render(<ProgressTracker items={items} />);
		rerender(<ProgressTracker items={completedStages} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testMultiStepRenderTransitions(progressTrackerStages);
	});

	it('should set single step transitions', () => {
		const { rerender } = render(<ProgressTracker items={items} />);
		const changedStages = items.map((stage) => {
			if (stage.id === '1') {
				const newStage: Stage = {
					id: '1',
					label: 'Step 1',
					percentageComplete: 50,
					href: '#',
					status: 'current',
				};
				return newStage;
			}
			return stage;
		});
		rerender(<ProgressTracker items={changedStages} />);

		const progressTrackerStages = screen.getAllByRole('listitem');
		testNoOrSingleStepRenderTransitions(progressTrackerStages);
	});

	it('should adapt to having a stage added', () => {
		const { rerender } = render(<ProgressTracker items={items} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(6);

		const newItems = items.map((oldStage) => {
			return {
				...oldStage,
				percentageComplete: 100,
			};
		});

		const newStage: Stage = {
			id: '7',
			label: 'Step 7',
			percentageComplete: 0,
			href: '#',
			status: 'unvisited',
		};

		newItems.push(newStage);

		rerender(<ProgressTracker items={newItems} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(newItems.length);
	});

	it('should adapt to having a stage removed', () => {
		const { rerender } = render(<ProgressTracker items={items} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(6);

		const newItems = items.slice(0, 4);

		rerender(<ProgressTracker items={newItems} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(newItems.length);
	});
});
