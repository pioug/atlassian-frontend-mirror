import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { ForbiddenWithObjectRequestAccessClient } from '@atlaskit/link-test-helpers';

import { Card } from '../../src';
import { type OnErrorCallback } from '../../src/view/types';

type DataType = Parameters<OnErrorCallback>[0];

export default (): JSX.Element => {
	const [data, setData] = React.useState<DataType | undefined>(undefined);

	const handleError = React.useCallback(
		(data: DataType) => {
			setData(data);
		},
		[setData],
	);

	return (
		<SmartCardProvider client={new ForbiddenWithObjectRequestAccessClient()}>
			<Card onError={handleError} url="https://some.url" appearance="block" platform="web" />
			<br />
			{data !== undefined && (
				<div>
					<span>The data object passed into onError is:</span>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)}
		</SmartCardProvider>
	);
};
