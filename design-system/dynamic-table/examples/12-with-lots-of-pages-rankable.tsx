/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import DynamicTable from '@atlaskit/dynamic-table';
import Toggle from '@atlaskit/toggle';

import { createHead, rows } from './content/sample-data';

export default function DynamicTableRankableExample() {
	const [isFixedSize, setIsFixedSize] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onToggleFixedChange = useCallback(() => {
		setIsFixedSize((isFixedSize) => !isFixedSize);
	}, [setIsFixedSize]);

	const onLoadingChange = useCallback(() => {
		setIsLoading((isLoading) => !isLoading);
	}, [setIsLoading]);

	return (
		<div>
			<div>
				<Toggle label="Fixed size" onChange={onToggleFixedChange} isChecked={isFixedSize} />
				Fixed size
			</div>
			<div>
				<Toggle label="Loading" onChange={onLoadingChange} isChecked={isLoading} />
				Loading
			</div>
			<DynamicTable
				caption="List of US Presidents"
				head={createHead(isFixedSize)}
				rows={rows}
				rowsPerPage={5}
				defaultPage={1}
				isRankable
				isLoading={isLoading}
				onRankStart={(params) => console.log('onRankStart', params)}
				onRankEnd={(params) => console.log('onRankEnd', params)}
				onSort={() => console.log('onSort')}
				onSetPage={() => console.log('onSetPage')}
				testId="my-table"
			/>
		</div>
	);
}
