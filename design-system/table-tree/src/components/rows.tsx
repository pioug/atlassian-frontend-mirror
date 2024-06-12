import React, { Component } from 'react';

import Items from './internal/items';

type WithChildren<T> = T & { children?: T[] | null };

export interface RowsProps<T> {
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items?: WithChildren<T>[];
	render: (args: WithChildren<T>) => React.ReactNode;
	loadingLabel?: string;
}

export default class Rows<T> extends Component<RowsProps<T>> {
	render() {
		const { items, render, loadingLabel = 'Loading' } = this.props;
		return (
			<div role="rowgroup">
				<Items items={items} loadingLabel={loadingLabel} render={render} />
			</div>
		);
	}
}
