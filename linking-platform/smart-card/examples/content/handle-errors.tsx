import React, { useState } from 'react';

import Banner from '@atlaskit/banner';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../../src';

const FallbackComponent = () => {
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
			An unexpected error happend and this is a custom fallback component.{' '}
			<a href="/packages/linking-platform/smart-card/docs/handle-errors">Learn more</a>
		</Banner>
	);
};

export default () => {
	const [failedUrl, setFailedUrl] = useState<string | null>(null);
	const handleError = ({ err, url }: { err?: Error; url: string }) => {
		if (err) {
			setFailedUrl(url);
		}
	};

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
			{failedUrl && <span>{`Failed URL from the onError callback function is: ${failedUrl}`}</span>}
		</SmartCardProvider>
	);
};
