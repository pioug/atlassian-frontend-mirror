import React, { useState } from 'react';
import { Card, Provider } from '../src';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Banner from '@atlaskit/banner';

const FallbackComponent = () => {
	return (
		<Banner appearance="error" icon={<ErrorIcon label="" secondaryColor="inherit" />}>
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
		<Provider>
			<Card
				onError={handleError}
				fallbackComponent={FallbackComponent}
				onResolve={() => {
					throw new Error('Unexpected error');
				}}
				url={'https://www.atlassian.com/'}
				appearance="block"
			/>
			<br />
			{failedUrl && <span>{`Failed URL from the onError callback function is: ${failedUrl}`}</span>}
		</Provider>
	);
};
