import React from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import Link from '@atlaskit/link';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../../src';
import { type OnErrorCallback } from '../../src/view/types';

const FallbackComponent = (): JSX.Element => {
	return (
		<Banner
			appearance="error"
			icon={
				<ErrorIcon
					color="currentColor"
					spacing="spacious"
					label=""
					LEGACY_secondaryColor="inherit"
				/>
			}
		>
			An unexpected error occurred and this is a custom fallback component.
			<br />
			<Link href="/packages/linking-platform/smart-card/docs/handle-errors">Learn more</Link>
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

	return (
		<SmartCardProvider>
			<Card
				onError={handleError}
				fallbackComponent={FallbackComponent}
				onResolve={() => {
					throw new Error('Unexpected error');
				}}
				url="https://www.atlassian.com/"
				appearance="block"
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
