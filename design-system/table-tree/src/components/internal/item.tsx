/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @repo/internal/react/no-clone-element */
import { cloneElement, type ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import toItemId from '../../utils/to-item-id';
import { type RowProps } from '../row';
import { type RowsProps } from '../rows';

import Items from './items';

type ItemProps<Item> = {
	/**
	 * @default 0
	 */
	depth?: number;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Item & { children?: Item[] };
	render: (
		arg: Item & { children?: Item[] },
	) => ReactElement<RowProps<Item> | RowsProps<Item>> | null;
	loadingLabel?: string;
	key?: string;
};

/**
 * __Item__
 * Internal item component.
 */
function Item<Item extends { id: string }>({
	depth = 0,
	data,
	render,
	loadingLabel,
}: ItemProps<Item>) {
	const renderedRow = render(data);

	if (!renderedRow) {
		return null;
	}

	// itemId exists on RowProps, but not on RowsProps
	const itemId = 'itemId' in renderedRow.props ? renderedRow.props.itemId : undefined;
	const items = renderedRow.props.items;

	return cloneElement(renderedRow, {
		depth,
		data,
		loadingLabel,
		renderChildren: () => (
			<div id={!!itemId ? toItemId(itemId) : undefined}>
				<Items depth={depth} items={items} render={render} loadingLabel={loadingLabel} />
			</div>
		),
	});
}

export default Item;
