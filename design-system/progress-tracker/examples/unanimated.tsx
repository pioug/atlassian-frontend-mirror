import React, { type FC, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

import { ProgressTracker, type Stages } from '../src';

const items: Stages = [...Array(6)].map((_num, index) => {
	return {
		id: `${index + 1}`,
		label: `Step ${index + 1}`,
		percentageComplete: 0,
		status: index === 0 ? 'current' : 'unvisited',
		href: '#',
	};
});

const completedStages: Stages = [...Array(6)].map((_num, index, arr) => {
	return {
		id: `${index + 1}`,
		label: `Step ${index + 1}`,
		percentageComplete: index === arr.length - 1 ? 0 : 100,
		status: index === arr.length - 1 ? 'current' : 'visited',
		href: '#',
	};
});

interface State {
	current: number;
	items: Stages;
}

const ProgressExample: FC = () => {
	const [state, setState] = useState<State>({
		current: 1,
		items,
	});

	const next = () => {
		const currentId = state.current;
		const nextId = currentId + 1;

		const newStages: Stages = state.items.map((currentItem) => {
			const currentItemId = parseInt(currentItem.id, 10);
			if (currentItemId === currentId) {
				return {
					...currentItem,
					percentageComplete: 100,
					status: 'visited',
				};
			} else if (currentItemId === nextId) {
				return {
					...currentItem,
					percentageComplete: 0,
					status: 'current',
				};
			} else {
				return currentItem;
			}
		});

		setState({
			current: nextId,
			items: newStages,
		});
	};

	const prev = () => {
		const currentId = state.current;
		const previousId = currentId - 1;

		const newStages: Stages = state.items.map((currentItem) => {
			const currentItemId = parseInt(currentItem.id, 10);
			if (currentItemId === currentId) {
				return {
					...currentItem,
					percentageComplete: 0,
					status: 'unvisited',
				};
			} else if (currentItemId === currentId - 1) {
				return {
					...currentItem,
					percentageComplete: 0,
					status: 'current',
				};
			} else {
				return currentItem;
			}
		});

		setState({
			current: previousId,
			items: newStages,
		});
	};

	const reset = () => {
		setState({
			current: 1,
			items,
		});
	};

	const completeAll = () => {
		setState({
			current: 6,
			items: completedStages,
		});
	};

	return (
		<Box>
			<ProgressTracker items={state.items} animated={false} />
			<Button
				onClick={() => next()}
				isDisabled={state.current === state.items.length ? true : false}
			>
				Next
			</Button>
			<Button onClick={() => prev()} isDisabled={state.current === 0 ? true : false}>
				Prev
			</Button>
			<Button onClick={() => reset()}>Reset</Button>
			<Button onClick={() => completeAll()}>completeAll</Button>
		</Box>
	);
};

export default () => <ProgressExample />;
