import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

import { ProgressTracker, type Stage, type Stages } from '../src';

const items: Stages = [
	{
		id: '1',
		label: 'Step 1',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
	{
		id: '2',
		label: 'Step 2',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: '3',
		label: 'Step 3',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: '4',
		label: 'Step 4',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: '5',
		label: 'Step 5',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: '6',
		label: 'Step 6',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

const completedStages: Stages = [
	{
		id: '1',
		label: 'Step 1',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: '2',
		label: 'Step 2',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: '3',
		label: 'Step 3',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: '4',
		label: 'Step 4',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: '5',
		label: 'Step 5',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: '6',
		label: 'Step 6',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
];

interface State {
	current: number;
	items: Stages;
}

class ProgressExample extends Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = {
			current: 1,
			items,
		};
	}

	next() {
		const currentId = this.state.current;
		const completed: Stage = {
			id: `${currentId}`,
			label: `Step ${currentId}`,
			percentageComplete: 100,
			status: 'visited',
			href: '#',
		};
		const nextId = currentId + 1;
		const next: Stage = {
			id: `${nextId}`,
			label: `Step ${nextId}`,
			percentageComplete: 0,
			status: 'current',
			href: '#',
		};

		const newstages: Stages = this.state.items.map((x) => {
			if (x.id === `${currentId}`) {
				return completed;
			}
			if (x.id === `${nextId}`) {
				return next;
			}
			return x;
		});

		this.setState({
			current: nextId,
			items: newstages,
		});
	}

	prev() {
		const currentId = this.state.current;
		const completed: Stage = {
			id: `${currentId}`,
			label: `Step ${currentId}`,
			percentageComplete: 0,
			status: 'unvisited',
			href: '#',
		};
		const prevId = currentId - 1;
		const prev: Stage = {
			id: `${prevId}`,
			label: `Step ${prevId}`,
			percentageComplete: 0,
			status: 'current',
			href: '#',
		};

		const newstages: Stages = this.state.items.map((x) => {
			if (x.id === `${currentId}`) {
				return completed;
			}
			if (x.id === `${prevId}`) {
				return prev;
			}
			return x;
		});

		this.setState({
			current: prevId,
			items: newstages,
		});
	}

	reset() {
		this.setState({
			current: 1,
			items,
		});
	}

	completeAll() {
		this.setState({
			current: 6,
			items: completedStages,
		});
	}

	render() {
		return (
			<Box>
				<ProgressTracker items={this.state.items} animated={false} />
				<Button onClick={() => this.next()}>Next</Button>
				<Button onClick={() => this.prev()}>Prev</Button>
				<Button onClick={() => this.reset()}>Reset</Button>
				<Button onClick={() => this.completeAll()}>completeAll</Button>
			</Box>
		);
	}
}

export default () => <ProgressExample />;
