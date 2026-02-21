import React, { useState } from 'react';

import Banner from '@atlaskit/banner';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import WarningIcon from '@atlaskit/icon/core/status-warning';

import { head, rows } from './content/sample-data';

export default function TableControlled(): React.JSX.Element {
	const [pageNumber, setPageNumber] = useState(3);
	const navigateTo = (pageNumber: number) => {
		setPageNumber(pageNumber);
	};

	return (
		<>
			<Banner appearance="warning" icon={<WarningIcon spacing="spacious" label="" />}>
				This is a stateless table example, which doesn't have pagination support. To navigate pages,
				use the "Previous page" and "Next page" buttons.
			</Banner>

			<ButtonGroup label="Paging navigation">
				<Button isDisabled={pageNumber === 1} onClick={() => navigateTo(pageNumber - 1)}>
					Previous Page
				</Button>
				<Button isDisabled={pageNumber === 5} onClick={() => navigateTo(pageNumber + 1)}>
					Next Page
				</Button>
			</ButtonGroup>
			<DynamicTableStateless
				head={head}
				rows={rows}
				rowsPerPage={5}
				page={pageNumber}
				loadingSpinnerSize="large"
				isLoading={false}
				isFixedSize
				sortKey="term"
				sortOrder="DESC"
				onSort={() => console.log('onSort')}
				onSetPage={() => console.log('onSetPage')}
			/>
		</>
	);
}
