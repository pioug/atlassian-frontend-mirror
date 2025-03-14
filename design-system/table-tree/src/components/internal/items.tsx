import React, { type ReactElement, useState } from 'react';

import { type RowProps } from '../row';

import Item from './item';
import LoaderItem from './loader-item';

interface ItemsProps<Item> {
	depth?: number;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items?: Item[] | null;
	loadingLabel?: string;
	render: (arg: Item & { children?: Item[] }) => ReactElement<RowProps<Item>> | null;
}

function Items<Item extends { id: string }>({
	depth = 0,
	items,
	loadingLabel,
	render,
}: ItemsProps<Item>) {
	const [isLoaderShown, setIsLoaderShown] = useState(false);

	const handleLoaderComplete = () => setIsLoaderShown(false);

	return !items || isLoaderShown ? (
		<LoaderItem
			isCompleting={!!(items && items.length)}
			onComplete={handleLoaderComplete}
			depth={depth + 1}
			loadingLabel={loadingLabel}
		/>
	) : (
		<>
			{items.map((data) => (
				<Item
					data={data}
					depth={depth + 1}
					key={data.id}
					render={render}
					loadingLabel={loadingLabel}
				/>
			))}
		</>
	);
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Items;
