import React, { Component } from 'react';

import Items from './internal/items';

type WithChildren<T> = T & { children?: T[] | null };

export interface RowsProps<T> {
	/**
	 * The data used to render the set of rows. Will be passed down via the `children` render prop.
	 *
	 * In addition to these props, any other data can be added to the object, and it will
	 * be provided as props when rendering each cell.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items?: WithChildren<T>[];
	/**
	 * Render function for child rows. Render props will contain an item from the
	 * `items` prop above.
	 */
	render: (args: WithChildren<T>) => React.ReactNode;
	/* eslint-enable jsdoc/require-asterisk-prefix, jsdoc/check-alignment */
	/**
	 * This is an accessible name for the loading state's spinner.
	 * The default text is "Loading".
	 */
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
