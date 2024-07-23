/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useEffect, useMemo, useRef } from 'react';
import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import { getPulseStyles } from './styled';

const LOCAL_STORAGE_CLIENT_KEY = '@atlaskit/smart-card';
const LOCAL_STORAGE_DISCOVERY_KEY = 'action-discovery-ai-summarise';
const LOCAL_STORAGE_DISCOVERY_VALUE = 'discovered';
const LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS = 15552000000; // 180 days
const LOCAL_STORAGE_DISCOVERY_REQUIRED_TIME = 2000;

export type FeatureDiscoveryProps = {
	children: React.ReactElement;
	testId?: string;
};

/**
 * This is a hacky solution to help with the feature discovery.
 * This implementation must be removed once the experiment is completed.
 * Cleanup on https://product-fabric.atlassian.net/browse/EDM-9649
 */
const FeatureDiscovery = ({ children, testId }: FeatureDiscoveryProps): JSX.Element => {
	const renderedTime = useRef<number>();

	const storageClient = useMemo(() => new StorageClient(LOCAL_STORAGE_CLIENT_KEY), []);

	const discovered = useMemo(
		() => storageClient.getItem(LOCAL_STORAGE_DISCOVERY_KEY) === LOCAL_STORAGE_DISCOVERY_VALUE,
		[storageClient],
	);

	useEffect(() => {
		renderedTime.current = Date.now();

		return () => {
			if (!discovered && renderedTime.current) {
				const duration = Date.now() - renderedTime.current;
				if (duration > LOCAL_STORAGE_DISCOVERY_REQUIRED_TIME) {
					storageClient.setItemWithExpiry(
						LOCAL_STORAGE_DISCOVERY_KEY,
						LOCAL_STORAGE_DISCOVERY_VALUE,
						LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS,
					);
				}
			}
		};
	}, [storageClient, discovered]);

	const component = useMemo(() => {
		if (!discovered) {
			return (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<span css={getPulseStyles()} data-testid={`${testId}-discovery`}>
					{children}
				</span>
			);
		}
	}, [children, discovered, testId]);

	return component ?? children;
};

export default FeatureDiscovery;
