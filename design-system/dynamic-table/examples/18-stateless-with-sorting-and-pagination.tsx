import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type SortOrderType } from '@atlaskit/dynamic-table/types';
import { withPlatformFeatureGates } from '@atlassian/feature-flags-storybook-utils';

import { caption, visuallyRefreshedHead, visuallyRefreshedRows } from './content/sample-data';

type HeadCell = (typeof visuallyRefreshedHead)['cells'][number];

const ControlledSorting = () => {
	const [pageNumber, setPageNumber] = useState<number>(2);
	const [sortOrder, setSortOrder] = useState<SortOrderType>('ASC');
	const [sortKey, setSortKey] = useState<HeadCell['key']>('name');

	const onSort = ({ key, sortOrder }: any) => {
		setSortKey(key);
		setSortOrder(sortOrder);
	};

	const navigateTo = (pageNumber: number) => setPageNumber(pageNumber);

	return (
		<div>
			<ButtonGroup label="Paging navigation">
				<Button isDisabled={pageNumber === 1} onClick={() => navigateTo(pageNumber - 1)}>
					Previous Page
				</Button>
				<Button isDisabled={pageNumber === 5} onClick={() => navigateTo(pageNumber + 1)}>
					Next Page
				</Button>
			</ButtonGroup>
			<DynamicTableStateless
				caption={caption}
				head={visuallyRefreshedHead}
				rows={visuallyRefreshedRows}
				rowsPerPage={10}
				page={pageNumber}
				isFixedSize
				sortKey={sortKey}
				sortOrder={sortOrder}
				onSort={onSort}
				onSetPage={navigateTo}
			/>
		</div>
	);
};

export default ControlledSorting;

ControlledSorting.decorators = [
	withPlatformFeatureGates({
		'platform-component-visual-refresh': true,
	}),
];
