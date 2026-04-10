import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { type OnErrorCallback } from '../../src/view/types';

const FallbackComponent = (): JSX.Element => {
	return (
		<Banner
			appearance="error"
			icon={<ErrorIcon color="currentColor" spacing="spacious" label="" />}
		>
			An unexpected error occurred and this is a custom fallback component.
		</Banner>
	);
};

type DataType = Parameters<OnErrorCallback>[0];

export default (): JSX.Element => {
	const [data, setData] = React.useState<DataType | undefined>(undefined);

	const handleError = React.useCallback(
		(data: DataType) => {
			setData(data);
		},
		[setData],
	);

	const handleOnResolve = React.useCallback(() => {
		throw new Error('Unexpected error');
	}, []);

	return (
		<SmartCardProvider>
			<Card
				onError={handleError}
				fallbackComponent={FallbackComponent}
				onResolve={handleOnResolve}
				url="https://www.atlassian.com/"
				appearance="inline"
			/>
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
