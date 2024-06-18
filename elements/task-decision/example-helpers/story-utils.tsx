/** @jsx jsx */

import React from 'react';
import { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

export const Grid = ({ children }: React.PropsWithChildren<unknown>) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'row',
		}}
	>
		{children}
	</div>
);

export const Item = ({ children }: React.PropsWithChildren<unknown>) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		css={{
			flex: '1 1 0',
			margin: 10,
		}}
	>
		{children}
	</div>
);

export const dumpRef = (ref: HTMLElement | null) => {
	// eslint-disable-next-line no-console
	console.log('Content HTML', ref && ref.outerHTML);
};

export const action = (action: string) => () => {
	// eslint-disable-next-line no-console
	console.log({ action });
};

interface Props {
	render: (
		taskStates: Map<string, boolean>,
		onChangeListener: (taskId: string, done: boolean) => void,
	) => JSX.Element;
}

interface State {
	tick: number;
}

export class TaskStateManager extends PureComponent<Props, State> {
	private taskStates = new Map<string, boolean>();

	constructor(props: Props) {
		super(props);
		this.state = {
			tick: 0,
		};
	}

	private onChangeListener = (taskId: string, done: boolean) => {
		action('onChange')();
		this.taskStates.set(taskId, done);
		this.setState({ tick: this.state.tick + 1 });
	};

	render() {
		return <div>{this.props.render(this.taskStates, this.onChangeListener)}</div>;
	}
}
