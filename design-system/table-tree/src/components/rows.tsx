import React, { type ReactElement } from 'react';

import Items from './internal/items';
import { type RowProps } from './row';

type Content = {
	title: string;
	description: string;
};

export interface RowsProps<Item> {
	/**
	 * The data used to render the set of rows. Will be passed down via the `children` render prop.
	 *
	 * In addition to these props, any other data can be added to the object, and it will
	 * be provided as props when rendering each cell.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items?: Item[];
	/**
	 * Render function for child rows. Render props will contain an item from the
	 * `items` prop above.
	 */
	render: (
		args: Item & { children?: Item[]; content?: Content },
	) => ReactElement<RowProps<Item>> | null;
	/**
	 * This is an accessible name for the loading state's spinner.
	 * The default text is "Loading".
	 */
	loadingLabel?: string;
}

function Rows<T extends { id: string }>({
	items,
	render,
	loadingLabel = 'Loading',
}: RowsProps<T>): React.JSX.Element {
	return (
		<div role="rowgroup">
			<Items items={items} loadingLabel={loadingLabel} render={render} />
		</div>
	);
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Rows;
