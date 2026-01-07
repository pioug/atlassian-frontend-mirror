import React from 'react';

import { render, screen } from '@testing-library/react';

import { ProgressTracker, type Stages } from '../../index';

const generateStages = ({
	count,
	currentIndex,
}: {
	count: number;
	currentIndex?: number;
}): Stages => {
	const getStatus = (index: number) => {
		if (currentIndex === undefined) {
			return 'unvisited';
		}
		return index === currentIndex ? 'current' : index < currentIndex ? 'visited' : 'unvisited';
	};

	const getPercentage = () =>
		currentIndex === undefined ? 0 : ((currentIndex - 1) / (count - 1)) * 100;

	return new Array(count).fill('').map((_, index) => ({
		id: `${index + 1}`,
		label: `Step ${index + 1}`,
		percentageComplete: getPercentage(),
		href: '#',
		status: getStatus(index),
	}));
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<ProgressTracker />', () => {
	it('should have default label where there is no label passed', () => {
		render(<ProgressTracker items={generateStages({ count: 6 })} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list?.getAttribute('aria-label')).toBe('Progress');
	});

	it('should set received label as aria-label of steps list', () => {
		render(<ProgressTracker items={generateStages({ count: 6 })} label="Test label" />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list?.getAttribute('aria-label')).toBe('Test label');
	});

	it('stage list item should have an aria-current set as step', () => {
		render(
			<ProgressTracker items={generateStages({ count: 6, currentIndex: 3 })} label="Test label" />,
		);

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(6);
		expect(listItems[3]).toHaveAttribute('aria-current', 'step');
	});
});
