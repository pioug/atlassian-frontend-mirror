/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import { DynamicTableStateless } from '../src';
import { type SortOrderType } from '../src/types';

import { caption, head, rows } from './content/sample-data';

type HeadCell = (typeof head)['cells'][number];

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
				head={head}
				rows={rows}
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
